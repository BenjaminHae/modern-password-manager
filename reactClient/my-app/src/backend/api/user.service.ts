import { UserApi as OpenAPIUserService, ChangePassword as OpenAPIChangePassword, GenericSuccessMessage } from '@pm-server/pm-server-react-client';
import { CryptedObject } from '../models/cryptedObject';
import { encryptedAccount } from '../models/encryptedAccount';
import { AccountTransformerService } from '../controller/account-transformer.service';

export interface ILogonInformation {
  lastLogin?: Date | null;
  failedLogins?: number;
}

export class UserService {

  constructor(private userService: OpenAPIUserService, private accountTransformer: AccountTransformerService) { }

  private checkForSuccess(response: GenericSuccessMessage) {
    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async logon(username: string, password: CryptedObject): Promise<ILogonInformation> {
    let response = await this.userService.loginUser({ logonInformation: { "username": username, "password": password.toBase64JSON()  }});
    this.checkForSuccess(response);
    if (response.failedLogins !== undefined)
      throw new Error("failedLogin undefined");
    let result = { failedLogins: response.failedLogins, lastLogin: response.lastLogin}
    return result;
  }

  async logout(): Promise<void> {
    let response = await this.userService.logoutUser();
    this.checkForSuccess(response);
  }

  async register(username: string, password: CryptedObject, email: string): Promise<void> {
    let response = await this.userService.registerUser({ "registrationInformation": {"username": username, "password": password.toBase64JSON(), "email": email} });
    this.checkForSuccess(response);
  }

  async changePassword(newHash: CryptedObject, accounts: Array<encryptedAccount>): Promise<void> {
    let requestData: OpenAPIChangePassword = {};
    requestData.newPassword = newHash.toBase64JSON();
    requestData.accounts = accounts.map((account) => {
        return this.accountTransformer.encryptedAccountToOpenAPI(account);
        });
    let response = await this.userService.changePassword({changePassword: requestData});
    this.checkForSuccess(response);
  }
}
