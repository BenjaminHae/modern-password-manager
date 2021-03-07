import { MaintenanceApi as OpenAPIMaintenanceService } from '@pm-server/pm-server-react-client';
import { CSRFMiddleware } from './CSRFMiddleware';
import { base64ToArrayBuffer } from './helpers';

export interface BackendOptions {
  registrationAllowed: boolean;
  idleTimeout: number;
  defaultUserConfiguration: string;
  webAuthNChallenge?: ArrayBuffer;
}
export class MaintenanceService {

  constructor(private maintenanceService: OpenAPIMaintenanceService, private csrfMiddleware: CSRFMiddleware) { }

  async retrieveInfo(): Promise<BackendOptions> {
    const serverInformation = await this.maintenanceService.serverInformation()
    if (serverInformation.csrfToken) {
      this.csrfMiddleware.csrfToken = serverInformation.csrfToken;
    }
    const registrationAllowed = serverInformation.allowRegistration ? serverInformation.allowRegistration: false;
    const idleTimeout = serverInformation.idleTimeout ? serverInformation.idleTimeout: 3*60*1000;
    const defaultUserConfiguration = serverInformation.defaultUserConfiguration ? serverInformation.defaultUserConfiguration: "{}";
    let challenge: undefined | ArrayBuffer;
    if (serverInformation.webAuthNChallenge) {
      challenge = base64ToArrayBuffer(serverInformation.webAuthNChallenge);
    }
    return { 
      registrationAllowed: registrationAllowed, idleTimeout: idleTimeout, defaultUserConfiguration: defaultUserConfiguration, webAuthNChallenge: challenge}
  }
}
