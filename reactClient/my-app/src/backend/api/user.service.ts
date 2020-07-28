import { UserApi as OpenAPIUserService, ChangePassword as OpenAPIChangePassword, GenericSuccessMessage, HistoryItem } from '@pm-server/pm-server-react-client';
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
    if (response.failedLogins === undefined)
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

  async changePassword(oldHash: CryptedObject, newHash: CryptedObject, accounts: Array<encryptedAccount>): Promise<void> {
    let requestData: OpenAPIChangePassword = {
          oldPassword: oldHash.toBase64JSON(),
          newPassword: newHash.toBase64JSON(),
          accounts: []
        };
    requestData.accounts = accounts.map((account) => {
        return this.accountTransformer.encryptedAccountToOpenAPI(account);
        });
    let response = await this.userService.changePassword({changePassword: requestData});
    this.checkForSuccess(response);
  }

  async getHistory(): Promise<Array<HistoryItem>> {
    return this.userService.getUserHistory();
  }

  async getUserSettings(): Promise<CryptedObject | null> {
    const data = await this.userService.getUserSettings();
    if (data["encryptedUserSettings"])
      return CryptedObject.fromBase64JSON(data["encryptedUserSettings"]);
    return null;
  }

  async storeUserSettings(options: CryptedObject): Promise<void> {
    const response = await this.userService.setUserSettings({ userSettings: { encryptedUserSettings: options.toBase64JSON() } } );
    this.checkForSuccess(response);
  }
}
