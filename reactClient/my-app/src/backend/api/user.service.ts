import { UserApi as OpenAPIUserService, ChangePassword as OpenAPIChangePassword, GenericSuccessMessage, HistoryItem, UserWebAuthnCred } from '@pm-server/pm-server-react-client';
import { CryptedObject } from '../models/cryptedObject';
import { encryptedAccount } from '../models/encryptedAccount';
import { AccountTransformerService } from '../controller/account-transformer.service';
import { base64ToArrayBuffer, arrayBufferToBase64 } from './helpers';

export interface ILogonInformation {
  lastLogin?: Date | null;
  failedLogins?: number;
}

export interface IWebAuthnLogonInformation extends ILogonInformation{
  wrappedServerKey: ArrayBuffer;
}

export class UserService {

  constructor(private userService: OpenAPIUserService, private accountTransformer: AccountTransformerService) { }

  private checkForSuccess(response: GenericSuccessMessage): void {
    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async logon(username: string, password: CryptedObject): Promise<ILogonInformation> {
    const response = await this.userService.loginUser({ logonInformation: { "username": username, "password": password.toBase64JSON()  }});
    this.checkForSuccess(response);
    if (response.failedLogins === undefined)
      throw new Error("failedLogin undefined");
    const result = { failedLogins: response.failedLogins, lastLogin: response.lastLogin}
    return result;
  }

  async logout(): Promise<void> {
    const response = await this.userService.logoutUser();
    this.checkForSuccess(response);
  }

  async register(username: string, password: CryptedObject, email: string): Promise<void> {
    const response = await this.userService.registerUser({ "registrationInformation": {"username": username, "password": password.toBase64JSON(), "email": email} });
    this.checkForSuccess(response);
  }

  async changePassword(oldHash: CryptedObject, newHash: CryptedObject, accounts: Array<encryptedAccount>): Promise<void> {
    const requestData: OpenAPIChangePassword = {
          oldPassword: oldHash.toBase64JSON(),
          newPassword: newHash.toBase64JSON(),
          accounts: []
        };
    requestData.accounts = accounts.map((account) => {
        return this.accountTransformer.encryptedAccountToOpenAPI(account);
        });
    const response = await this.userService.changePassword({changePassword: requestData});
    this.checkForSuccess(response);
  }

  async getHistory(): Promise<Array<HistoryItem>> {
    return this.userService.getUserHistory();
  }

  async getWebAuthnCreds(): Promise<Array<UserWebAuthnCred>> {
    return this.userService.getUserWebAuthnCreds();
  }

  async registerWebAuthn( id: string, name: string, attestationObject: ArrayBuffer, clientDataJSON: ArrayBuffer, keyType: string, wrappedServerKey: ArrayBuffer ): Promise<void> {
    const response = await this.userService.createUserWebAuthn({ userWebAuthnCreateWithKey: 
      { 
        id: id, 
        name: name, 
        response: { 
          attestationObject: arrayBufferToBase64(attestationObject), 
          clientDataJSON: arrayBufferToBase64(clientDataJSON), 
          "type": keyType 
        }, 
        decryptionKey: arrayBufferToBase64(wrappedServerKey)
      } });
    this.checkForSuccess(response);
  }

  async loginWebAuthn( id: string, authenticatorData: ArrayBuffer, clientDataJSON: ArrayBuffer, signature: ArrayBuffer, keyType: string): Promise<IWebAuthnLogonInformation> {
    const response = await this.userService.loginUserWebAuthnGet({userWebAuthnGet: 
      {
        id: id, 
        response: {
          authenticatorData: arrayBufferToBase64(authenticatorData),
          clientDataJSON: arrayBufferToBase64(clientDataJSON),
          signature: arrayBufferToBase64(signature),
          type: keyType
        }
      }})
    this.checkForSuccess(response);
    if (response.failedLogins === undefined)
      throw new Error("failedLogin undefined");
    if (response.decryptionKey === undefined)
      throw new Error("no decryption key specified");
    return { failedLogins: response.failedLogins, lastLogin: response.lastLogin, wrappedServerKey: base64ToArrayBuffer(response.decryptionKey)};
  }

  async deleteWebAuthn(id: number): Promise<Array<UserWebAuthnCred>> {
    return await this.userService.deleteUserWebAuthn({id: id});
  }

  async getWebAuthnChallenge(): Promise<ArrayBuffer> {
    const response = await this.userService.loginUserWebAuthnChallenge();
    return base64ToArrayBuffer(response.challenge);
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
