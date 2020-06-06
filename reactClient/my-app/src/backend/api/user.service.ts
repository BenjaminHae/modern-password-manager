import { UserApi as OpenAPIUserService, ChangePassword as OpenAPIChangePassword, GenericSuccessMessage } from '@pm-server/pm-server-react-client';
import { CryptedObject } from '../models/cryptedObject';
import { encryptedAccount } from '../models/encryptedAccount';
import { AccountTransformerService } from '../controller/account-transformer.service';

export class UserService {

  constructor(private userService: OpenAPIUserService, private accountTransformer: AccountTransformerService) { }

  logon(username: string, password: CryptedObject): Promise<GenericSuccessMessage> {
    return this.userService.loginUser({ logonInformation: { "username": username, "password": password.toBase64JSON()  }});
  }

  logout(): Promise<GenericSuccessMessage> {
     return this.userService.logoutUser();
  }

  register(username: string, password: CryptedObject, email: string): Promise<GenericSuccessMessage> {
    return this.userService.registerUser({ "registrationInformation": {"username": username, "password": password.toBase64JSON(), "email": email} });
  }

  changePassword(newHash: CryptedObject, accounts: Array<encryptedAccount>): Promise<GenericSuccessMessage> {
    let requestData: OpenAPIChangePassword = {};
    requestData.newPassword = newHash.toBase64JSON();
    requestData.accounts = accounts.map((account) => {
        return this.accountTransformer.encryptedAccountToOpenAPI(account);
        });
    return this.userService.changePassword({changePassword: requestData});
  }
}
