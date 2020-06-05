import { Account } from './models/account';
import { CryptedObject } from './models/cryptedObject';
import { encryptedAccount } from './models/encryptedAccount';
import { MaintenanceService } from './api/maintenance.service';
import { UserService } from './api/user.service';
import { AccountsService } from './api/accounts.service';
import { ServerSettings } from './models/serverSettings';
import { FieldOptions } from './models/fieldOptions';
import { AccountTransformerService } from './controller/account-transformer.service';
import { CredentialService } from './credential.service';
import { CredentialProvider } from './controller/credentialProvider';
import { CryptoService } from './crypto.service';
import { Observable } from 'rxjs';

function subscriptionCreator(list: Array<any>): any {
    return (observer: any) => {
      list.push(observer);
      return {
        unsubscribe() {
          list.splice(list.indexOf(observer), 1);
        }
      }
    };
}
function subscriptionExecutor(list: Array<any>, params:any) {
  list.forEach(obs => obs.next(params));
}
export class BackendService {
  private accountsObservers = [];
  private loginObservers = [];
  private optionsObservers = [];
  public serverSettings: ServerSettings = {allowRegistration: true, passwordGenerator: "aaaaab"};
  public accounts: Array<Account> = [];
  public fields: Array<FieldOptions> = [];
  accountsObservable = new Observable<Array<Account>>(subscriptionCreator(this.accountsObservers));
  loginObservable = new Observable<void>(subscriptionCreator(this.loginObservers));
  optionsObservable = new Observable<Array<FieldOptions>>(subscriptionCreator(this.optionsObservers));

  constructor(private maintenanceService: MaintenanceService, private userService: UserService, private accountsService: AccountsService, private credentials: CredentialService, private accountTransformer: AccountTransformerService, private crypto: CryptoService ) {}

  async waitForBackend(): Promise<void> {
    console.log("waiting for maintenanceService");
    await this.maintenanceService.retrieveInfo();
  }

  async logon(username: string, password: string): Promise<void> {
    await this.credentials.generateFromPassword(password);
    let passwordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
    await this.userService.logon(username, passwordHash)
    await this.afterLogin();
  }

  async changeUserPassword(newPassword: string): Promise<any> {
    let newCredentials = new CredentialProvider();
    await newCredentials.generateFromPassword(newPassword)
    let newPasswordHash = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12), newCredentials)
    let newHash = newPasswordHash;
    let newAccounts: Array<encryptedAccount> = [];
    for (let account of this.accounts) {
      newAccounts.push(await this.reencryptAccount(account, newCredentials));
    }
    return await this.userService.changePassword(newHash, newAccounts);
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
    subscriptionExecutor(this.loginObservers, null);
    let accounts = await this.accountsService.getAccounts()
    this.fields = [
      { name: "Username", colNumber: 1, selector: "user", visible: true, sortable: true },
      { name: "URL", selector: "url", visible: false }
    ];
    subscriptionExecutor(this.optionsObservers, this.fields);
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
    subscriptionExecutor(this.accountsObservers, accounts);
  }

  async register(username: string, password: string, email: string): Promise<any> {
    await this.credentials.generateFromPassword(password)
    let ciphertext = await this.crypto.encryptChar(this.serverSettings.passwordGenerator, new Uint8Array(12))
    return await this.userService.register(username, ciphertext, email)
  }

  addAccount(account: Account): Promise<any> {
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
