import { Account } from './models/account';
import { CryptedObject } from './models/cryptedObject';
import { encryptedAccount } from './models/encryptedAccount';
import { UserOptions, UserOptionsFromJSON } from './models/UserOptions';
import { MaintenanceService, BackendOptions } from './api/maintenance.service';
import { UserService, ILogonInformation } from './api/user.service';
import { HistoryItem } from '@pm-server/pm-server-react-client';
import { AccountsService } from './api/accounts.service';
import { ServerSettings } from './models/serverSettings';
import { AccountTransformerService } from './controller/account-transformer.service';
import { CredentialService } from './credential.service';
import { CredentialProviderPassword } from './controller/credentialProviderPassword';
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
  accountsObservable = new Observable<Array<Account>>(subscriptionCreator(this.accountsObservers));
  loginObservable = new Observable<void>(subscriptionCreator(this.loginObservers));
  optionsObservable = new Observable<UserOptions>(subscriptionCreator(this.optionsObservers));

  constructor(private maintenanceService: MaintenanceService, private userService: UserService, private accountsService: AccountsService, private credentials: CredentialService, private accountTransformer: AccountTransformerService, private crypto: CryptoService ) {}

  async waitForBackend(): Promise<BackendOptions> {
    return await this.maintenanceService.retrieveInfo();
  }

  async logon(username: string, password: string): Promise<ILogonInformation> {
    let credentialProvider = new CredentialProviderPassword();
    await credentialProvider.generateFromPassword(password);
    return await this.logonWithCredentials(credentialProvider, username);
  }

  async logonWithCredentials(credentialProvider: ICredentialProvider, username?: string): Promise<ILogonInformation> {
    this.credentials.setProvider(credentialProvider);
    let response: ILogonInformation = {};
    if (username) {
      let passwordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
      response = await this.userService.logon(username, passwordHash)
    }
    await this.afterLogin();
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
    let newAccounts: Array<encryptedAccount> = [];
    for (let account of this.accounts) {
      newAccounts.push(await this.reencryptAccount(account, newCredentials));
    }
    await this.userService.changePassword(oldPasswordHash, newPasswordHash, newAccounts);
    this.credentials.setProvider(newCredentials);
    return;
  }

  async verifyPassword(password: string): Promise<boolean> {
    let testCredentials = new CredentialProviderPassword();
    await testCredentials.generateFromPassword(password)
    let newPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12), testCredentials)
    let oldPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
    return oldPasswordHash.toBase64JSON() === newPasswordHash.toBase64JSON();
  }

  async reencryptAccount(account: Account, newCredentials: ICredentialProvider): Promise<encryptedAccount> {
    let password = await this.accountTransformer.getPassword(account)
    let enpassword = await this.crypto.encryptChar(password, undefined, newCredentials);
          //todo! File-Keys?
    account.enpassword = enpassword;
    return await this.accountTransformer.encryptAccount(account, newCredentials);
  }

  async getUserOptions() {
    const encryptedUserConfiguration = await this.userService.getUserSettings();
    const defaultUserOptions: UserOptions = 
    this.userOptions = {
        fields: [
        { name: "username", colNumber: 1, selector: "user", visible: true, sortable: true },
        { name: "url", selector: "url", visible: false },
        { name: "tags", selector: "tags", visible: true }
      ]
    };
    if (encryptedUserConfiguration) {
      try {
        let data = JSON.parse(await this.crypto.decryptChar(encryptedUserConfiguration));
        this.userOptions = UserOptionsFromJSON(data, this.userOptions);
      }
      catch {
      }
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

  async afterLogin(): Promise<void> {
    subscriptionExecutor(this.loginObservers);
    let accounts = await this.accountsService.getAccounts()
    await this.getUserOptions();
    return await this.parseAccounts(accounts)
  }

  private async parseAccounts(encAccounts: Array<encryptedAccount>): Promise<void> {
    console.log("received " + encAccounts.length + " accounts");
    let accounts: Array<Account> = [];
    for (let encAccount of encAccounts) {
        let decAccount =  await this.accountTransformer.decryptAccount(encAccount);
        accounts.push( decAccount );
    }
    this.accounts = accounts;
    subscriptionExecutor<Array<Account>>(this.accountsObservers, accounts);
  }

  async register(username: string, password: string, email: string): Promise<void> {
    let newCredentials = new CredentialProviderPassword();
    await newCredentials.generateFromPassword(password)
    this.credentials.setProvider(newCredentials);
    let ciphertext = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
    return await this.userService.register(username, ciphertext, email)
  }

  addAccount(account: Account): Promise<void> {
    return this.addAccounts([account]);
  }

  async addAccounts(newAccounts: Array<Account>): Promise<void> {
    let encAccounts: Array<encryptedAccount> = [];
    for (let account of newAccounts) {
      let encAccount = await this.accountTransformer.encryptAccount(account);
      encAccounts.push(encAccount);
    }
    let accounts = await this.accountsService.addAccounts(encAccounts)
    return await this.parseAccounts(accounts)
  }

  async updateAccount(account: Account): Promise<void> {
    let encAccount = await this.accountTransformer.encryptAccount(account)
    let accounts = await this.accountsService.updateAccount(encAccount)
    return await this.parseAccounts(accounts)
  }

  async deleteAccount(account: Account): Promise<void> {
    let accounts = await this.accountsService.deleteAccount(account.index)
    return await this.parseAccounts(accounts)
  }

  async getHistory(): Promise<Array<HistoryItem>> {
    return await this.userService.getHistory();
  }

  async getPassword(account: Account): Promise<string> {
    return await this.accountTransformer.getPassword(account);
  }

}
