import { IMessageOptions } from '../libs/MessageManager';
import { Account } from '../backend/models/account';

export interface IExportCsvProps {
  accounts: Array<Account>;
  getAccountPasswordHandler: (account: Account) => Promise<string>;
  verifyPassword: (password: string) => Promise<boolean>;
  showMessage: (message: string, options?: IMessageOptions) => void;
}

