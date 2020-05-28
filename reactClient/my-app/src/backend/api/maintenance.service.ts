import { MaintenanceApi as OpenAPIMaintenanceService, ServerInformation } from '@pm-server/pm-server-react-client';

export class MaintenanceService {

  constructor(private maintenanceService: OpenAPIMaintenanceService) { }

  async retrieveInfo(): Promise<void> {
    let serverInformation = await this.maintenanceService.serverInformation()
    // todo set csrf token
    //if (!this.maintenanceService.configuration.apiKeys)
    //  this.maintenanceService.configuration.apiKeys = {};
    //this.maintenanceService.configuration.apiKeys["X-CSRF-TOKEN"] = serverInformation.csrfToken;
  }
}
