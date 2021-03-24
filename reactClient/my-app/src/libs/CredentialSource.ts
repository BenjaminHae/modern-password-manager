import { ILogonInformation } from '../backend/api/user.service';

export enum CredentialReadiness {
  automated,
  automatedWithInteraction,
  manual,
  notAvailable
}

export interface ICredentialSource {
  credentialsReady: () => Promise<boolean>;
  credentialReadinessSupported: () => CredentialReadiness;
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

  private async firstReadyCredentialOfGroup(group: Array<ICredentialSource>): Promise<ICredentialSource|null> {
    for (const source of group) {
      if (await source.credentialsReady())
        return source;
    }
    return null;
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
    }
    finally {
      this.autoLoginStateSetter(false);
    }
    return info;
  }

  async getCredentials(autoLogin = true): Promise<ILogonInformation|null> {
    let priorityList = [ CredentialReadiness.manual ]
    if (autoLogin) {
      priorityList = [ 
        CredentialReadiness.automated, 
        CredentialReadiness.automatedWithInteraction, 
      ].concat(priorityList);
    }
    for (const readiness of priorityList) {
      this.debug(`Getting ready credentials of group ${CredentialReadiness[readiness]}`);
      if (readiness in this.sources && this.sources[readiness].length > 0) {
        // todo: this is not very clever as it skips the "second" ready credential of a group
        const firstReadySource = await this.firstReadyCredentialOfGroup(this.sources[readiness]);
        if (firstReadySource) {
          this.debug(`${firstReadySource.constructor.name} is ready`);
          try {
            const info = await this.doLoginWithSource(firstReadySource, readiness !== CredentialReadiness.manual);
            if (info) {
              this.debug(`successful got credential from ${firstReadySource.constructor.name}`);
              return info;
            }
            this.debug(`${firstReadySource.constructor.name} failed`);
          }
          catch(e) {
            this.debug(`${firstReadySource.constructor.name} failed with error: ${e.message}`);
            this.showMessage(`Login failed: ${e.message}`);
          }
        }
      }
    }
    this.debug(`did not find any sources that work`);
    return null;
  }

}

