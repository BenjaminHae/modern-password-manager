import { ILogonInformation } from '../backend/api/user.service';

export enum AuthenticatorReadiness {
  automated,
  automatedWithInteraction,
  manual,
  notAvailable
}

export interface IAuthenticationProvider {
  authenticatorReadinessSupported: () => AuthenticatorReadiness;
  autoRetryAllowed: () => boolean;
  authenticatorReady: () => Promise<boolean>;
  performAuthentication: () => Promise<ILogonInformation|null>;
}

function checkForObjectAndMethod(thing: unknown, item: string): boolean {
  return (typeof thing === "object") && (thing !== null) && (item in thing);
}

export function instanceOfAuthenticationProvider(object: unknown): object is IAuthenticationProvider {
  return checkForObjectAndMethod(object, 'authenticatorReady')
    && checkForObjectAndMethod(object, 'authenticatorReadinessSupported')
    && checkForObjectAndMethod(object, 'performAuthentication');
}

export default class AuthenticationProviderManager {
  private sources: Record<AuthenticatorReadiness, Array<IAuthenticationProvider>> = {
      [AuthenticatorReadiness.automated]: [],
      [AuthenticatorReadiness.automatedWithInteraction]: [],
      [AuthenticatorReadiness.manual]: [],
      [AuthenticatorReadiness.notAvailable]: []
  };
  private sourcesList: Array<IAuthenticationProvider> = [];

  constructor (private autoLoginStateSetter:(state:boolean) => void, private debug: (msg: string)=>void, private showMessage: (msg:string)=>void) {
  }

  registerAuthenticationProvider(source: IAuthenticationProvider): void {
    this.debug(`registering authentication provider ${source.constructor.name}`);
    this.sourcesList.push(source);
    this.sources[source.authenticatorReadinessSupported()].push(source);
  }


  async doLoginWithProvider(provider: IAuthenticationProvider, setAutoLoginState = false): Promise<ILogonInformation|null> {
    if (setAutoLoginState) {
      this.autoLoginStateSetter(true);
    }
    let info: ILogonInformation|null = null;
    try {
      info = await provider.performAuthentication();
    }
    catch(e) {
      if (e instanceof Error) {
        this.debug(`${provider.constructor.name} failed: ${e.message}`)
        this.showMessage(`Login failed: ${e.message}`);
      }
    }
    finally {
      this.autoLoginStateSetter(false);
    }
    return info;
  }

  async performAuthenticationSimultaneously(providers: Array<IAuthenticationProvider>): Promise<ILogonInformation|null> {
    // chain for retrieving credentials and retrying
    const performAuthenticationMultipleTimes = async (provider: IAuthenticationProvider): Promise<ILogonInformation|null> => {
      const result = await this.doLoginWithProvider(provider, false);
      if (result !== null) {
        this.debug(`${provider.constructor.name} did authentication`);
        return result;
      }
      this.debug(`${provider.constructor.name} could not perform authentication`);
      if (provider.autoRetryAllowed()) {
        this.debug(`retrying for ${provider.constructor.name}`);
        return await performAuthenticationMultipleTimes(provider);
      }
      this.debug(`${provider.constructor.name} failed`);
      return Promise.reject();
    };
    // check which credentialssources are ready and execute chain
    const promises = providers.map((provider: IAuthenticationProvider): Promise<ILogonInformation|null> => { 
      this.debug(`checking readiness of ${provider.constructor.name}`);
      return provider.authenticatorReady()
      .then((ready: boolean): Promise<ILogonInformation|null> => {
        if (!ready) {
          this.debug(`${provider.constructor.name} is not ready`);
          return Promise.reject();
        }
          this.debug(`${provider.constructor.name} is ready`);
        return performAuthenticationMultipleTimes(provider);
      })
    });
    return Promise.any<ILogonInformation|null>(promises);
  }

  async performAuthentication(autoLogin = true): Promise<ILogonInformation|null> {
    if (autoLogin) {
      const priorityList = [ 
        AuthenticatorReadiness.automated, 
        AuthenticatorReadiness.automatedWithInteraction, 
      ]
      for (const readiness of priorityList) {
        this.debug(`Getting ready authenticators of group ${AuthenticatorReadiness[readiness]}`);
        if (readiness in this.sources && this.sources[readiness].length > 0) {
          for (const provider of this.sources[readiness]) {
            if (await provider.authenticatorReady()) {
              this.debug(`${provider.constructor.name} is ready`);
              const info = await this.doLoginWithProvider(provider, readiness !== AuthenticatorReadiness.manual);
              if (info) {
                this.debug(`successful authentication with ${provider.constructor.name}`);
                return info;
              }
              this.debug(`${provider.constructor.name} failed`);
            }
          }
        }
      }
    }
    if (AuthenticatorReadiness.manual in this.sources && this.sources[AuthenticatorReadiness.manual].length > 0) {
      this.debug(`trying all manual authenticators at the same time`);
      return this.performAuthenticationSimultaneously(this.sources[AuthenticatorReadiness.manual]);
    }
    this.debug(`did not find any authenticators that work`);
    return null;
  }

}

