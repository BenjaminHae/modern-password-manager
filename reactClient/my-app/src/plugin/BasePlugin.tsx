import { PluginSystem } from './PluginSystem';
import { Account } from '../backend/models/account';
import { AccountTransformerService } from '../backend/controller/account-transformer.service';

export abstract class BasePlugin {
  constructor (protected pluginSystem: PluginSystem) {
  }
}

/* Possible callbacks:
  editInputPrepend(inputKey: string, value: string, account?: Account): JSX.Element | void
  editInputAppend(inputKey: string, value: string, account?: Account): JSX.Element | void
  accountPreStore(newAccount, oldAccount: Account): Account 
  }*/

export interface IPluginWithMainView {
  MainViewJSX: () => JSX.Element | void;
}

export interface IPluginWithFilter {
  resetFilter: () => void;
}

export interface IPluginWithAccountsReady {
  accountsReady: (accounts: Array<Account>) => void;
}

export interface IPluginWithAccountButton {
  accountButton: (account: Account) => void | JSX.Element;
}

export interface IPluginWithPasswordButton {
  passwordButton: (account: Account) => void | JSX.Element;
}

export interface IPluginWithLoginSuccessful {
  loginSuccessful: (username: string, key: CryptoKey) => void;
}

export interface IPluginWithPreLogout {
  preLogout: () => void;
}

export interface IPluginWithLoginViewReady {
  loginViewReady: () => void;
}

export interface IPluginWithEditPreShow {
  editPreShow: (fields: {[index: string]:string}, account?: Account) => void;
}

export interface IPluginWithEditInputButton {
  editInputButton: (inputKey: string, currentValue: string, setValue: (val: string) => void, account?: Account) => JSX.Element | void;
}

export interface IPluginRequiresTransformer {
  setTransformer: (transformer: AccountTransformerService) => void;
}

export function instanceOfIPluginWithMainView(object: unknown): object is IPluginWithMainView {
  return 'MainViewJSX' in object;
}

export function instanceOfIPluginWithFilter(object: unknown): object is IPluginWithFilter {
  return 'resetFilter' in object;
}

export function instanceOfIPluginWithAccountsReady(object: unknown): object is IPluginWithAccountsReady {
  return 'accountsReady' in object;
}

export function instanceOfIPluginWithAccountButton(object: unknown): object is IPluginWithAccountButton {
  return 'accountButton' in object;
}

export function instanceOfIPluginWithPasswordButton(object: unknown): object is IPluginWithPasswordButton {
  return 'passwordButton' in object;
}

export function instanceOfIPluginWithLoginSuccessful(object: unknown): object is IPluginWithLoginSuccessful {
  return 'loginSuccessful' in object;
}

export function instanceOfIPluginWithPreLogout(object: unknown): object is IPluginWithPreLogout {
  return 'preLogout' in object;
}

export function instanceOfIPluginWithLoginViewReady(object: unknown): object is IPluginWithLoginViewReady {
  return 'loginViewReady' in object;
}

export function instanceOfIPluginWithEditInputButton(object: unknown): object is IPluginWithEditInputButton {
  return 'editInputButton' in object;
}

export function instanceOfIPluginWithEditPreShow(object: unknown): object is IPluginWithEditPreShow {
  return 'editPreShow' in object;
}

export function instanceOfIPluginRequiresTransformer(object: unknown): object is IPluginRequiresTransformer {
  return 'setTransformer' in object;
}

