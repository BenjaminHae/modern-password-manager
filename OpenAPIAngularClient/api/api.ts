export * from './accounts.service';
import { AccountsService } from './accounts.service';
export * from './maintenance.service';
import { MaintenanceService } from './maintenance.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [AccountsService, MaintenanceService, UserService];
