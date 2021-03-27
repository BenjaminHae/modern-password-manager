import { ILogonInformation } from '../backend/api/user.service';

export enum CredentialReadiness {
  automated,
  automatedWithInteraction,
  manual,
  notAvailable
}

export interface ICredentialSource {
  credentialReadinessSupported: () => CredentialReadiness;
  autoRetryAllowed: () => boolean;
  credentialsReady: () => Promise<boolean>;
  retrieveCredentials: () => Promise<ILogonInformation|null>;
}

function checkForObjectAndMethod(thing: unknown, item: string): boolean {
  return (typeof thing === "object") && (thing !== null) && (item in thing);
}

export function instanceOfCredentialSource(object: unknown): object is ICredentialSource {
  return checkForObjectAndMethod(object, 'credentialsReady')
    && checkForObjectAndMethod(object, 'credentialReadinessSupported')
    && checkForObjectAndMethod(object, 'retrieveCredentials');
}

export default class CredentialSourceManager {
  private sources: Record<CredentialReadiness, Array<ICredentialSource>> = {
      [CredentialReadiness.automated]: [],
      [CredentialReadiness.automatedWithInteraction]: [],
      [CredentialReadiness.manual]: [],
      [CredentialReadiness.notAvailable]: []
  };
  private sourcesList: Array<ICredentialSource> = [];

  constructor (private autoLoginStateSetter:(state:boolean) => void, private debug: (msg: string)=>void, private showMessage: (msg:string)=>void) {
  }

  registerCredentialSource(source: ICredentialSource): void {
    this.debug(`registering credential source ${source.constructor.name}`);
    this.sourcesList.push(source);
    this.sources[source.credentialReadinessSupported()].push(source);
  }


  async doLoginWithSource(source: ICredentialSource, setAutoLoginState = false): Promise<ILogonInformation|null> {
    if (setAutoLoginState) {
      this.autoLoginStateSetter(true);
    }
    let info: ILogonInformation|null = null;
    try {
      info = await source.retrieveCredentials();
    }
    catch(e) {
      this.debug(`${source.constructor.name} failed: ${e.message}`)
      this.showMessage(`Login failed: ${e.message}`);
    }
    finally {
      this.autoLoginStateSetter(false);
    }
    return info;
  }

  async performCredentialsSimultaneously(sources: Array<ICredentialSource>): Promise<ILogonInformation|null> {
    // chain for retrieving credentials and retrying
    const retrieveCredentialsMultipleTimes = async (source: ICredentialSource): Promise<ILogonInformation|null> => {
      const result = await this.doLoginWithSource(source, false);
      if (result !== null) {
        this.debug(`${source.constructor.name} has credentials`);
        return result;
      }
      this.debug(`${source.constructor.name} has no credentials`);
      if (source.autoRetryAllowed()) {
        this.debug(`retrying for ${source.constructor.name}`);
        return await retrieveCredentialsMultipleTimes(source);
      }
      this.debug(`${source.constructor.name} failed`);
      return Promise.reject();
    };
    // check which credentialssources are ready and execute chain
    const promises = sources.map((source: ICredentialSource): Promise<ILogonInformation|null> => { 
      this.debug(`checking readiness of ${source.constructor.name}`);
      return source.credentialsReady()
      .then((ready: boolean): Promise<ILogonInformation|null> => {
        if (!ready) {
          this.debug(`${source.constructor.name} is not ready`);
          return Promise.reject();
        }
          this.debug(`${source.constructor.name} is ready`);
        return retrieveCredentialsMultipleTimes(source);
      })
    });
    return Promise.any<ILogonInformation|null>(promises);
  }

  async getCredentials(autoLogin = true): Promise<ILogonInformation|null> {
    if (autoLogin) {
      const priorityList = [ 
        CredentialReadiness.automated, 
        CredentialReadiness.automatedWithInteraction, 
      ]
      for (const readiness of priorityList) {
        this.debug(`Getting ready credentials of group ${CredentialReadiness[readiness]}`);
        if (readiness in this.sources && this.sources[readiness].length > 0) {
          for (const source of this.sources[readiness]) {
            if (await source.credentialsReady()) {
              this.debug(`${source.constructor.name} is ready`);
              const info = await this.doLoginWithSource(source, readiness !== CredentialReadiness.manual);
              if (info) {
                this.debug(`successful got credential from ${source.constructor.name}`);
                return info;
              }
              this.debug(`${source.constructor.name} failed`);
            }
          }
        }
      }
    }
    if (CredentialReadiness.manual in this.sources && this.sources[CredentialReadiness.manual].length > 0) {
      this.debug(`trying all manual sources at the same time`);
      return this.performCredentialsSimultaneously(this.sources[CredentialReadiness.manual]);
    }
    this.debug(`did not find any sources that work`);
    return null;
  }

}

