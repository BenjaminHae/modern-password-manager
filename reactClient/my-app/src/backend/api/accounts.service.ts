import { AccountsApi as OpenAPIAccountsService, AccountId } from '@pm-server/pm-server-react-client';
import { encryptedAccount } from '../models/encryptedAccount';
import { AccountTransformerService } from '../controller/account-transformer.service';

export class AccountsService {

  constructor(private accountsService: OpenAPIAccountsService, private accountTransformer: AccountTransformerService) { }

  //Maps OpenAPI Accounts to encryptedAccounts
  //private mapAccounts(): OperatorFunction<Array<AccountId>, Array<encryptedAccount>> {
  //  return map((accounts: Array<AccountId>): Array<encryptedAccount> => {
  //          return accounts.map((account: AccountId) => {
  //              return this.accountTransformer.encryptedAccountFromOpenAPI(account);
  //              });
  //          });
  //}

  async getAccounts(): Promise<Array<encryptedAccount>> {
    let outAccounts = await this.accountsService.getAccounts()
    return outAccounts.map((account: AccountId) => {
        return this.accountTransformer.encryptedAccountFromOpenAPI(account);
        });
  }

  async addAccount(account: encryptedAccount): Promise<Array<encryptedAccount>> {
    return this.addAccounts([account]);
  }

  async addAccounts(accounts: Array<encryptedAccount>): Promise<Array<encryptedAccount>> {
    let outAccounts = await this.accountsService.addAccounts({account: accounts.map(this.accountTransformer.encryptedAccountToOpenAPI)})
    return outAccounts.map((account: AccountId) => {
        return this.accountTransformer.encryptedAccountFromOpenAPI(account);
        });
  }

  async updateAccount(account: encryptedAccount): Promise<Array<encryptedAccount>> {
    let outAccounts = await this.accountsService.updateAccount(
                          { 
                            id: account.index, 
                            account: this.accountTransformer.encryptedAccountToOpenAPI(account)
                          }
                        )
    return outAccounts.map(
              (account: AccountId): encryptedAccount => {
                return this.accountTransformer.encryptedAccountFromOpenAPI(account);
              }
            );
  }

  async deleteAccount(index: number) {
    let outAccounts = await this.accountsService.deleteAccount({ id: index})
    return outAccounts.map((account: AccountId) => {
        return this.accountTransformer.encryptedAccountFromOpenAPI(account);
        });
  }
}
