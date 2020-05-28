import { MaintenanceApi as OpenAPIMaintenanceService } from '@pm-server/pm-server-react-client';
import { CSRFMiddleware } from './CSRFMiddleware';

export class MaintenanceService {

  constructor(private maintenanceService: OpenAPIMaintenanceService, private csrfMiddleware: CSRFMiddleware) { }

  async retrieveInfo(): Promise<void> {
    let serverInformation = await this.maintenanceService.serverInformation()
    if (serverInformation.csrfToken) {
      this.csrfMiddleware.csrfToken = serverInformation.csrfToken;
    }
  }
}
