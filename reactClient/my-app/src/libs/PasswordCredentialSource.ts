import { ICredentialSource, CredentialReadiness } from './CredentialSource';
import { BackendService } from '../backend/backend.service';
import { ILogonInformation } from '../backend/api/user.service';

interface IUsernameAndPassword {
  username: string, 
  password: string 
}

export default class PasswordCredentialSource implements ICredentialSource {
  private usernameAndPassword?: IUsernameAndPassword;
  private usernameAndPasswordWaiter?: (creds: IUsernameAndPassword) => void;
  constructor (private backend: BackendService, private debug: (value: string) => void) {
  }

  credentialReadinessSupported(): CredentialReadiness {
    return CredentialReadiness.manual;
  }
  async credentialsReady(): Promise<boolean> {
    this.debug(`return credentialsReady: true`);
    return Promise.resolve(true);
  }

  async retrieveCredentials(): Promise<ILogonInformation|null> {
    if (this.usernameAndPassword) {
      const usernameAndPassword = this.usernameAndPassword;
      this.debug(`username(${usernameAndPassword.username}) and password are present`);
      delete this.usernameAndPassword;
      return await this.backend.logon(usernameAndPassword.username, usernameAndPassword.password)
    }
    this.debug(`username and password not present, waiting`);
    return new Promise<ILogonInformation>((resolve) => 
      this.usernameAndPasswordWaiter = (usernameAndPassword: IUsernameAndPassword) => {
        this.debug(`username(${usernameAndPassword.username}) and password provided, doing logon`);
        this.backend.logon(usernameAndPassword.username, usernameAndPassword.password)
          .then((info) => { resolve(info) })
      // TODO
      //.catch((e) => {
      //  let msg = e.toString();
      //  if ("status" in e) {
      //    if (e.status === 500) {
      //      msg = "please reload page";
      //    }
      //    if (e.status === 401) {
      //      msg = "invalid credentials";
      //    }
      //  }
      //  this.messages.showMessage("Login failed, " + msg, { autoClose: false });
      //  this.setState({ authenticated: false });
      //});
      }
    );
  }

  provideUsernameAndPassword(username: string, password: string): void {
    if (this.usernameAndPasswordWaiter) {
      this.usernameAndPasswordWaiter( { username: username, password: password });
      delete this.usernameAndPasswordWaiter;
    }
    this.usernameAndPassword = { username: username, password: password };
  }
}
