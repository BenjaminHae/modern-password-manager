import { PluginSystem } from './PluginSystem';
import { Account } from '../backend/models/account';

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

export function instanceOfIPluginWithMainView(object: any): object is IPluginWithMainView {
  return 'MainViewJSX' in object;
}

export function instanceOfIPluginWithFilter(object: any): object is IPluginWithFilter {
  return 'resetFilter' in object;
}

export function instanceOfIPluginWithAccountsReady(object: any): object is IPluginWithAccountsReady {
  return 'accountsReady' in object;
}

