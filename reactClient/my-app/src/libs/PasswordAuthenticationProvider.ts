import { IAuthenticationProvider, AuthenticatorReadiness } from './AuthenticationProvider';
import { BackendService } from '../backend/backend.service';
import { ILogonInformation } from '../backend/api/user.service';

interface IUsernameAndPassword {
  username: string, 
  password: string 
}

export default class PasswordAuthenticationProvider implements IAuthenticationProvider {
  private usernameAndPassword?: IUsernameAndPassword;
  private usernameAndPasswordWaiter?: (creds: IUsernameAndPassword) => void;
  private waitForLoginFinished?: () => void;

  constructor (private backend: BackendService, private debug: (value: string) => void) {
  }

  authenticatorReadinessSupported(): AuthenticatorReadiness {
    return AuthenticatorReadiness.manual;
  }
  autoRetryAllowed(): boolean {
    return true;
  }
  callWaitForLoginFinished(): void {
    if (this.waitForLoginFinished) {
      const wFLF = this.waitForLoginFinished;
      delete this.waitForLoginFinished;
      wFLF();
    }
  }
  callUsernameAndPasswordWaiter(creds: IUsernameAndPassword): void {
    if (this.usernameAndPasswordWaiter) {
      const uAPW = this.usernameAndPasswordWaiter;
      delete this.usernameAndPasswordWaiter;
      uAPW(creds);
    }
  }
  async authenticatorReady(): Promise<boolean> {
    this.debug(`return credentialsReady: true`);
    return Promise.resolve(true);
  }

  async performAuthentication(): Promise<ILogonInformation|null> {
    if (this.usernameAndPassword) {
      const usernameAndPassword = this.usernameAndPassword;
      this.debug(`username(${usernameAndPassword.username}) and password are present`);
      delete this.usernameAndPassword;
      return await this.backend.logon(usernameAndPassword.username, usernameAndPassword.password)
          .then((info: ILogonInformation) => {
            this.callWaitForLoginFinished();
            return info;
          })
          .catch((e: any) => {
            this.callWaitForLoginFinished();
            let msg = e.toString();
            if ("status" in e) {
              if (e.status === 500) {
                msg = "please reload page";
              }
              if (e.status === 401) {
                msg = "invalid credentials";
              }
            }
            return Promise.reject(new Error(msg));
          });
    }
    this.debug(`username and password not present, waiting`);
    return new Promise<ILogonInformation>((resolve, reject) => 
      this.usernameAndPasswordWaiter = (usernameAndPassword: IUsernameAndPassword) => {
        this.debug(`username(${usernameAndPassword.username}) and password provided, doing logon`);
        delete this.usernameAndPassword;
        this.backend.logon(usernameAndPassword.username, usernameAndPassword.password)
          .then((info) => { 
            resolve(info); 
            this.callWaitForLoginFinished();
            return info;
          })
          .catch((e: any) => {
            this.callWaitForLoginFinished();
            let msg = e.toString();
            if ("status" in e) {
              if (e.status === 500) {
                msg = "please reload page";
              }
              if (e.status === 401) {
                msg = "invalid credentials";
              }
            }
            reject(new Error(msg));
          });
      }
    );
  }

  async provideUsernameAndPassword(username: string, password: string): Promise<void> {
    return new Promise((resolve) => {
      this.waitForLoginFinished = () => resolve();
      this.usernameAndPassword = { username: username, password: password };
      this.callUsernameAndPasswordWaiter({ username: username, password: password });
    });
  }
}
