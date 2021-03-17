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

  constructor (private autoLoginStateSetter:(state:boolean) => void, private debug: (msg: string)=>void) {
  }

  registerCredentialSource(source: ICredentialSource) {
    this.debug(`registering credential source ${source.constructor.name}`);
    this.sources[source.credentialReadinessSupported()].push(source);
  }

  private async firstReadyCredentialOfGroup(group: Array<ICredentialSource>): Promise<ICredentialSource|null> {
    for (const source of group) {
      if (await source.credentialsReady())
        return source;
    }
    return null;
  }

  async getCredentials(): Promise<ILogonInformation|null> {
    const priorityList = [ 
      CredentialReadiness.automated, 
      CredentialReadiness.automatedWithInteraction, 
      CredentialReadiness.manual 
    ];
    for (const readiness of priorityList) {
      this.debug(`Getting ready credentials of group ${CredentialReadiness[readiness]}`);
      if (readiness in this.sources && this.sources[readiness].length > 0) {
        // todo: this is not very clever as it skips the "second" ready credential of a group
        const firstReadySource = await this.firstReadyCredentialOfGroup(this.sources[readiness]);
        if (firstReadySource) {
          this.debug(`${firstReadySource.constructor.name} is ready`);
          if (readiness !== CredentialReadiness.manual) {
            this.autoLoginStateSetter(true);
          }
          const info = await firstReadySource.retrieveCredentials();
          this.autoLoginStateSetter(false);
          if (info) {
            return info;
          }
          this.debug(`${firstReadySource.constructor.name} failed`);
        }
      }
    }
    return null;
  }
}

