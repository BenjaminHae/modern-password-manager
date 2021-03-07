import { Account } from './models/account';
import { encryptedAccount } from './models/encryptedAccount';
import { UserOptions, UserOptionsFromJSON } from './models/UserOptions';
import { MaintenanceService, BackendOptions } from './api/maintenance.service';
import { UserService, ILogonInformation } from './api/user.service';
import { HistoryItem, UserWebAuthnCred } from '@pm-server/pm-server-react-client';
import { AccountsService } from './api/accounts.service';
import { ServerSettings } from './models/serverSettings';
import { AccountTransformerService } from './controller/account-transformer.service';
import { CredentialService } from './credential.service';
import { CredentialProviderPassword } from './controller/credentialProviderPassword';
import CredentialProviderPersist, { IPersistingMechanism }  from './controller/credentialProviderPersist';
import { ICredentialProvider } from './controller/credentialProvider';
import { CryptoService } from './crypto.service';
import { Observable, Subscriber, TeardownLogic } from 'rxjs';

function subscriptionCreator<T>(list: Array<Subscriber<T>>): (s: Subscriber<T>) => TeardownLogic {
    return (observer: Subscriber<T>) => {
      list.push(observer);
      return {
        unsubscribe() {
          list.splice(list.indexOf(observer), 1);
        }
      }
    };
}
function subscriptionExecutor<T>(list: Array<Subscriber<T>>, params?:T) {
  list.forEach(obs => obs.next(params));
}
export class BackendService {
  private accountsObservers: Array<Subscriber<Array<Account>>> = [];
  private loginObservers: Array<Subscriber<void>> = [];
  private optionsObservers: Array<Subscriber<UserOptions>> = [];
  public serverSettings: ServerSettings = {allowRegistration: true, passwordGenerator: "aaaaab"};
  public accounts: Array<Account> = [];
  public userOptions: UserOptions = { fields: [] };
  public defaultUserOptions: UserOptions = { fields: [] };
  private webAuthNChallenge?: ArrayBuffer;

  accountsObservable = new Observable<Array<Account>>(subscriptionCreator(this.accountsObservers));
  loginObservable = new Observable<void>(subscriptionCreator(this.loginObservers));
  optionsObservable = new Observable<UserOptions>(subscriptionCreator(this.optionsObservers));

  constructor(private maintenanceService: MaintenanceService, private userService: UserService, private accountsService: AccountsService, private credentials: CredentialService, private accountTransformer: AccountTransformerService, private crypto: CryptoService ) {}

  async waitForBackend(): Promise<BackendOptions> {
    const options = await this.maintenanceService.retrieveInfo();
    if (options.webAuthNChallenge) {
      this.webAuthNChallenge = options.webAuthNChallenge;
    }
    const userOptionsJSON = JSON.parse(options.defaultUserConfiguration);
    this.defaultUserOptions = UserOptionsFromJSON(userOptionsJSON, this.defaultUserOptions);
    return options;
  }

  async logon(username: string, password: string): Promise<ILogonInformation> {
    const credentialProvider = new CredentialProviderPassword();
    await credentialProvider.generateFromPassword(password);
    return await this.logonWithCredentials(credentialProvider, username);
  }

  // when username is provided, the logon endpoint on the server side is called
  // if it is not provided a valid server side session is assumed
  async logonWithCredentials(credentialProvider: ICredentialProvider, username?: string): Promise<ILogonInformation> {
    this.credentials.setProvider(credentialProvider);
    let response: ILogonInformation = {};
    if (username) {
      const passwordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
      response = await this.userService.logon(username, passwordHash)
    }
    await this.afterLogin();
    return response;
  }

  async logonWithWebAuthn( id: string, authenticatorData: ArrayBuffer, clientDataJSON: ArrayBuffer, signature: ArrayBuffer, keyType: string, keyIndex: number, persistor: IPersistingMechanism): Promise<ILogonInformation> {
    const response = await this.userService.loginWebAuthn(id, authenticatorData, clientDataJSON, signature, keyType)
    const creds = new CredentialProviderPersist(persistor);
    await creds.generateFromStoredKeys(response.wrappedServerKey, keyIndex);
    await this.logonWithCredentials(creds);
    return response;
  }

  async logout(): Promise<void> {
    await this.userService.logout();
    this.parseAccounts([]);
  }

  async changeUserPassword(oldPassword: string, newPassword: string): Promise<void> {
    if (await this.verifyPassword(oldPassword) !== true) {
      throw new Error("old Password does not match current password");
    }
    const oldPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
    const newCredentials = new CredentialProviderPassword();
    await newCredentials.generateFromPassword(newPassword)
    const newPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12), newCredentials)
    const newAccounts: Array<encryptedAccount> = [];
    for (const account of this.accounts) {
      newAccounts.push(await this.reencryptAccount(account, newCredentials));
    }
    await this.userService.changePassword(oldPasswordHash, newPasswordHash, newAccounts);
    this.credentials.setProvider(newCredentials);
    return;
  }

  async verifyPassword(password: string): Promise<boolean> {
    const testCredentials = new CredentialProviderPassword();
    await testCredentials.generateFromPassword(password)
    return this.verifyCredentials(testCredentials);
  }

  async verifyCredentials(testCredentials: ICredentialProvider): Promise<boolean> {
    const newPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12), testCredentials)
    const oldPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
    return oldPasswordHash.toBase64JSON() === newPasswordHash.toBase64JSON();
  }

  async reencryptAccount(account: Account, newCredentials: ICredentialProvider): Promise<encryptedAccount> {
    const password = await this.accountTransformer.getPassword(account)
    const enpassword = await this.crypto.encryptChar(password, undefined, newCredentials);
          //todo! File-Keys?
    account.enpassword = enpassword;
    return await this.accountTransformer.encryptAccount(account, newCredentials);
  }

  async getUserOptions(): Promise<void> {
    const encryptedUserConfiguration = await this.userService.getUserSettings();
    if (encryptedUserConfiguration) {
      try {
        const data = JSON.parse(await this.crypto.decryptChar(encryptedUserConfiguration));
        this.userOptions = UserOptionsFromJSON(data, this.defaultUserOptions);
      }
      catch {
        this.userOptions = this.defaultUserOptions;
      }
    }
    else {
      this.userOptions = this.defaultUserOptions;
    }
    subscriptionExecutor<UserOptions>(this.optionsObservers, this.userOptions);
  }

  async storeUserOptions(options: UserOptions): Promise<void> {
    const data = JSON.stringify(options);
    const cryptedOptions = await this.crypto.encryptChar(data);
    await this.userService.storeUserSettings(cryptedOptions);
    this.userOptions = options;
    subscriptionExecutor<UserOptions>(this.optionsObservers, this.userOptions);
  }

  afterLogin(): Promise<void> {
    delete this.webAuthNChallenge;//require new challenge for later operations
    subscriptionExecutor(this.loginObservers);
    return Promise.all([this.getUserOptions(), this.loadAccounts()])
      .then(()=>{return });
  }

  async loadAccounts(): Promise<void> {
    const accounts = await this.accountsService.getAccounts()
    return await this.parseAccounts(accounts)
  }

  private async parseAccounts(encAccounts: Array<encryptedAccount>): Promise<void> {
    console.log("received " + encAccounts.length + " accounts");
    const accounts: Array<Account> = [];
    for (const encAccount of encAccounts) {
        const decAccount =  await this.accountTransformer.decryptAccount(encAccount);
        accounts.push( decAccount );
    }
    this.accounts = accounts;
    subscriptionExecutor<Array<Account>>(this.accountsObservers, accounts);
  }

  async register(username: string, password: string, email: string): Promise<void> {
    const newCredentials = new CredentialProviderPassword();
    await newCredentials.generateFromPassword(password)
    this.credentials.setProvider(newCredentials);
    const ciphertext = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
    return await this.userService.register(username, ciphertext, email)
  }

  addAccount(account: Account): Promise<void> {
    return this.addAccounts([account]);
  }

  async addAccounts(newAccounts: Array<Account>): Promise<void> {
    const encAccounts: Array<encryptedAccount> = [];
    for (const account of newAccounts) {
      const encAccount = await this.accountTransformer.encryptAccount(account);
      encAccounts.push(encAccount);
    }
    const accounts = await this.accountsService.addAccounts(encAccounts)
    return await this.parseAccounts(accounts)
  }

  async updateAccount(account: Account): Promise<void> {
    const encAccount = await this.accountTransformer.encryptAccount(account)
    const accounts = await this.accountsService.updateAccount(encAccount)
    return await this.parseAccounts(accounts)
  }

  async deleteAccount(account: Account): Promise<void> {
    const accounts = await this.accountsService.deleteAccount(account.index)
    return await this.parseAccounts(accounts)
  }

  async getHistory(): Promise<Array<HistoryItem>> {
    return await this.userService.getHistory();
  }

  async getWebAuthnCreds(): Promise<Array<UserWebAuthnCred>> {
    return await this.userService.getWebAuthnCreds();
  }

  async getWebAuthnChallenge(): Promise<ArrayBuffer> {
    if (this.webAuthNChallenge) {
      const challenge = this.webAuthNChallenge;
      delete this.webAuthNChallenge;
      return challenge;
    }
    return await this.userService.getWebAuthnChallenge();
  }

  async createWebAuthn(id: string, name: string, attestationObject: ArrayBuffer, clientDataJSON: ArrayBuffer, keyType: string, wrappedDecryptionKey: ArrayBuffer ): Promise<void> {
    return await this.userService.registerWebAuthn(id, name, attestationObject, clientDataJSON, keyType, wrappedDecryptionKey);
  }

  async deleteWebAuthn(id: number): Promise<Array<UserWebAuthnCred>> {
    return await this.userService.deleteWebAuthn(id);
  }

  async getPassword(account: Account): Promise<string> {
    return await this.accountTransformer.getPassword(account);
  }

}
