import { Account } from './models/account';
import { CryptedObject } from './models/cryptedObject';
import { encryptedAccount } from './models/encryptedAccount';
import { MaintenanceService, BackendOptions } from './api/maintenance.service';
import { UserService } from './api/user.service';
import { AccountsService } from './api/accounts.service';
import { ServerSettings } from './models/serverSettings';
import { FieldOptions } from './models/fieldOptions';
import { AccountTransformerService } from './controller/account-transformer.service';
import { CredentialService } from './credential.service';
import { CredentialProviderPassword } from './controller/credentialProviderPassword';
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
  private optionsObservers: Array<Subscriber<Array<FieldOptions>>> = [];
  public serverSettings: ServerSettings = {allowRegistration: true, passwordGenerator: "aaaaab"};
  public accounts: Array<Account> = [];
  public fields: Array<FieldOptions> = [];
  accountsObservable = new Observable<Array<Account>>(subscriptionCreator(this.accountsObservers));
  loginObservable = new Observable<void>(subscriptionCreator(this.loginObservers));
  optionsObservable = new Observable<Array<FieldOptions>>(subscriptionCreator(this.optionsObservers));

  constructor(private maintenanceService: MaintenanceService, private userService: UserService, private accountsService: AccountsService, private credentials: CredentialService, private accountTransformer: AccountTransformerService, private crypto: CryptoService ) {}

  async waitForBackend(): Promise<BackendOptions> {
    return await this.maintenanceService.retrieveInfo();
  }

  async logon(username: string, password: string): Promise<void> {
    let credentialProvider = new CredentialProviderPassword();
    await credentialProvider.generateFromPassword(password);
    await this.logonWithCredentials(credentialProvider);
  }
  async logonWithCredentials(credentialProvider: ICredentialProvider, username?: string): Promise<void> {
    this.credentials.setProvider(credentialProvider);
    if (username) {
      let passwordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
      await this.userService.logon(username, passwordHash)
    }
    await this.afterLogin();
  }
  async logout(): Promise<void> {
    await this.userService.logout();
    this.fields = [];
    this.parseAccounts([]);
  }

  async changeUserPassword(newPassword: string): Promise<void> {
    let newCredentials = new CredentialProviderPassword();
    await newCredentials.generateFromPassword(newPassword)
    let newPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12), newCredentials)
    let newHash = newPasswordHash;
    let newAccounts: Array<encryptedAccount> = [];
    for (let account of this.accounts) {
      newAccounts.push(await this.reencryptAccount(account, newCredentials));
    }
    await this.userService.changePassword(newHash, newAccounts);
    this.credentials.setProvider(newCredentials);
    return;
  }

  async verifyPassword(password: string): Promise<boolean> {
    let testCredentials = new CredentialProvider();
    let newHash: CryptedObject;
    await testCredentials.generateFromPassword(password)
    let newPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12), testCredentials)
    newHash = newPasswordHash;
    let oldPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
    return oldPasswordHash.toBase64JSON() === newHash.toBase64JSON();
  }

  async reencryptAccount(account: Account, newCredentials: CredentialProvider): Promise<encryptedAccount> {
    let password = await this.accountTransformer.getPassword(account)
    let enpassword = await this.crypto.encryptChar(password, undefined, newCredentials);
          //todo! Aber was?
    account.enpassword = enpassword;
    return await this.accountTransformer.encryptAccount(account, newCredentials);
  }

  async afterLogin(): Promise<void> {
    subscriptionExecutor(this.loginObservers);
    let accounts = await this.accountsService.getAccounts()
    this.fields = [
      { name: "Username", colNumber: 1, selector: "user", visible: true, sortable: true },
      { name: "URL", selector: "url", visible: false }
    ];
    subscriptionExecutor<Array<FieldOptions>>(this.optionsObservers, this.fields);
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
    await newCredentials.generateFromPassword(newPassword)
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

}
