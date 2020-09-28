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

function checkForObjectAndMethod(thing: unknown, item: string): boolean {
  return (typeof thing === "object") && (item in thing);
}

export function instanceOfIPluginWithMainView(object: unknown): object is IPluginWithMainView {
  return checkForObjectAndMethod('MainViewJSX');
}

export function instanceOfIPluginWithFilter(object: unknown): object is IPluginWithFilter {
  return checkForObjectAndMethod('resetFilter');
}

export function instanceOfIPluginWithAccountsReady(object: unknown): object is IPluginWithAccountsReady {
  return checkForObjectAndMethod('accountsReady');
}

export function instanceOfIPluginWithAccountButton(object: unknown): object is IPluginWithAccountButton {
  return checkForObjectAndMethod('accountButton');
}

export function instanceOfIPluginWithPasswordButton(object: unknown): object is IPluginWithPasswordButton {
  return checkForObjectAndMethod('passwordButton');
}

export function instanceOfIPluginWithLoginSuccessful(object: unknown): object is IPluginWithLoginSuccessful {
  return checkForObjectAndMethod('loginSuccessful');
}

export function instanceOfIPluginWithPreLogout(object: unknown): object is IPluginWithPreLogout {
  return checkForObjectAndMethod('preLogout');
}

export function instanceOfIPluginWithLoginViewReady(object: unknown): object is IPluginWithLoginViewReady {
  return checkForObjectAndMethod('loginViewReady');
}

export function instanceOfIPluginWithEditInputButton(object: unknown): object is IPluginWithEditInputButton {
  return checkForObjectAndMethod('editInputButton');
}

export function instanceOfIPluginWithEditPreShow(object: unknown): object is IPluginWithEditPreShow {
  return checkForObjectAndMethod('editPreShow');
}

export function instanceOfIPluginRequiresTransformer(object: unknown): object is IPluginRequiresTransformer {
  return checkForObjectAndMethod('setTransformer');
}

