import { PluginSystem } from './PluginSystem';
import { Account } from '../backend/models/account';
import { AccountTransformerService } from '../backend/controller/account-transformer.service';
import { IDataTableColumn } from 'react-data-table-component';

export abstract class BasePlugin {
  constructor (protected pluginSystem: PluginSystem) {
  }
}

export interface IPluginWithMainView {
  MainViewJSX: () => JSX.Element;
}

export interface IPluginWithFilter {
  resetFilter: () => void;
}

export interface IPluginWithAccountsReady {
  accountsReady: (accounts: Array<Account>) => void;
}

export interface IPluginWithAccountList {
  accountList: (column: IDataTableColumn) => IDataTableColumn;
}

export interface IPluginWithLoginSuccessful {
  loginSuccessful: (username: string, key: any) => void;
}

export interface IPluginWithPreLogout {
  preLogout: () => void;
}

export interface IPluginRequiresTransformer {
  setTransformer: (transformer: AccountTransformerService) => void;
}

export function instanceOfIPluginWithMainView(object: any): object is IPluginWithMainView {
  return 'MainViewJSX' in object;
}

export function instanceOfIPluginWithFilter(object: any): object is IPluginWithFilter {
  return 'resetFilter' in object;
}

export function instanceOfIPluginWithAccountsReady(object: any): object is IPluginWithAccountsReady {
  return 'accountsReady' in object;
}

export function instanceOfIPluginWithAccountList(object: any): object is IPluginWithAccountList {
  return 'accountList' in object;
}

export function instanceOfIPluginWithLoginSuccessful(object: any): object is IPluginWithLoginSuccessful {
  return 'loginSuccessful' in object;
}

export function instanceOfIPluginWithPreLogout(object: any): object is IPluginWithPreLogout {
  return 'preLogout' in object;
}

export function instanceOfIPluginRequiresTransformer(object: any): object is IPluginRequiresTransformer {
  return 'setTransformer' in object;
}

