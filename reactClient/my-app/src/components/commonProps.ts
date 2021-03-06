import { IMessageOptions } from '../libs/MessageManager';
import { Account } from '../backend/models/account';
import { FieldOptions } from '../backend/models/fieldOptions';
import { UserWebAuthnCred } from '@pm-server/pm-server-react-client';
import { UserOptions } from '../backend/models/UserOptions';
import { HistoryItem } from '@pm-server/pm-server-react-client';
import { PluginSystem } from '../plugin/PluginSystem';
import ShortcutManager from '../libs/ShortcutManager';

export interface WebAuthnLocalProps {
  ready: boolean;
  autoLogin: () => Promise<void>;
}

export interface IExportCsvProps {
  accounts: Array<Account>;
  getAccountPasswordHandler: (account: Account) => Promise<string>;
  verifyPassword: (password: string) => Promise<boolean>;
  showMessage: (message: string, options?: IMessageOptions) => void;
}

export interface ImportCsvProps {
  availableFields: Array<FieldOptions>;
  bulkAddHandler: (newFields: Array<{[index: string]:string}>) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
}

export interface IWebAuthnProps {
  webAuthnDevices: Array<UserWebAuthnCred>;
  webAuthnThisDeviceRegistered: boolean;
  webAuthnLoadHandler: () => Promise<void>;
  webAuthnCreateCredHandler: (devicename: string, username: string, password: string) => Promise<void>;
  webAuthnDeleteCredHandler: (creds: UserWebAuthnCred) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
}

export interface IChangePasswordProps {
  changePasswordHandler: (oldPassword: string, newPassword: string) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
}

export interface IUserFieldConfigurationProps {
  userOptions: UserOptions;
  showMessage: (message: string, options: IMessageOptions) => void;
  doStoreOptions: (options: UserOptions) => Promise<void>;
}

export interface IUserSettingsProps extends IWebAuthnProps, IChangePasswordProps, IUserFieldConfigurationProps{
  showMessage: (message: string, options?: IMessageOptions) => void;
}

export interface IHistoryProps {
  historyItems: Array<HistoryItem>;
  loadHistoryHandler: () => Promise<void>;
}

export enum AuthenticatedView {
  List,
  Edit,
  Add,
  Import,
  Export,
  Options,
  History
}

export interface IAuthenticatedProps extends IUserSettingsProps, IHistoryProps, IExportCsvProps {
  view: AuthenticatedView,
  accounts: Array<Account>,

  changeView: (view: AuthenticatedView) => void,
  editAccountHandler: (fields: {[index: string]:string}, account?: Account) => Promise<void>,
  bulkAddHandler: (newFields: Array<{[index: string]:string}>) => Promise<void>,
  deleteAccountHandler: (account: Account) => Promise<void>,
  getAccountPasswordHandler: (account: Account) => Promise<string>,
  idleTimeout: number,
  onIdle: () => void;

  showMessage: (message: string, options?: IMessageOptions) => void,

  pluginSystem: PluginSystem,
  shortcuts: ShortcutManager
}
