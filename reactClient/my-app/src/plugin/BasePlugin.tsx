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

function checkForObjectAndMethods(thing: unknown, items: Array<string>): boolean {
  return (typeof thing === "object")  && (items.every((item) => item in thing));
}

function checkForObjectAndMethods(thing: unknown, item: string): boolean {
  return (typof thing === "object") && (item in thing);
}

export function instanceOfIPluginWithMainView(object: unknown): object is IPluginWithMainView {
  return checkForObjectAndMethods('MainViewJSX');
}

export function instanceOfIPluginWithFilter(object: unknown): object is IPluginWithFilter {
  return checkForObjectAndMethods('resetFilter');
}

export function instanceOfIPluginWithAccountsReady(object: unknown): object is IPluginWithAccountsReady {
  return checkForObjectAndMethods('accountsReady');
}

export function instanceOfIPluginWithAccountButton(object: unknown): object is IPluginWithAccountButton {
  return checkForObjectAndMethods('accountButton');
}

export function instanceOfIPluginWithPasswordButton(object: unknown): object is IPluginWithPasswordButton {
  return checkForObjectAndMethods('passwordButton');
}

export function instanceOfIPluginWithLoginSuccessful(object: unknown): object is IPluginWithLoginSuccessful {
  return checkForObjectAndMethods('loginSuccessful');
}

export function instanceOfIPluginWithPreLogout(object: unknown): object is IPluginWithPreLogout {
  return checkForObjectAndMethods('preLogout');
}

export function instanceOfIPluginWithLoginViewReady(object: unknown): object is IPluginWithLoginViewReady {
  return checkForObjectAndMethods('loginViewReady');
}

export function instanceOfIPluginWithEditInputButton(object: unknown): object is IPluginWithEditInputButton {
  return checkForObjectAndMethods('editInputButton');
}

export function instanceOfIPluginWithEditPreShow(object: unknown): object is IPluginWithEditPreShow {
  return checkForObjectAndMethods('editPreShow');
}

export function instanceOfIPluginRequiresTransformer(object: unknown): object is IPluginRequiresTransformer {
  return checkForObjectAndMethods('setTransformer');
}

