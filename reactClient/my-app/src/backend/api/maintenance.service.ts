import { MaintenanceApi as OpenAPIMaintenanceService } from '@pm-server/pm-server-react-client';
import { CSRFMiddleware } from './CSRFMiddleware';

export interface BackendOptions {
  registrationAllowed: boolean;
}
export class MaintenanceService {

  constructor(private maintenanceService: OpenAPIMaintenanceService, private csrfMiddleware: CSRFMiddleware) { }

  async retrieveInfo(): Promise<BackendOptions> {
    const serverInformation = await this.maintenanceService.serverInformation()
    if (serverInformation.csrfToken) {
      this.csrfMiddleware.csrfToken = serverInformation.csrfToken;
    }
    let registrationAllowed = false;
    if (serverInformation.allowRegistration) {
      registrationAllowed = serverInformation.allowRegistration
    }
    return { registrationAllowed: registrationAllowed }
  }
}
