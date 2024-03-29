import { Account } from '../backend/models/account';
import { BackendService } from '../backend/backend.service';
import { ICredentialProvider } from '../backend/controller/credentialProvider';
import { AccountTransformerService } from '../backend/controller/account-transformer.service';
import { ILogonInformation } from '../backend/api/user.service';
import activatedPlugins from './ActivatedPlugins';
import * as BasePlugin from './BasePlugin';
import { IMessageOptions } from '../libs/MessageManager';
import ShortcutManager from '../libs/ShortcutManager';
import { IAuthenticationProvider, instanceOfAuthenticationProvider } from '../libs/AuthenticationProvider';

export type AccountsFilter = (accounts: Array<Account>) => Array<Account>;
type AccountFilter = (account: Account) => boolean;

interface IAuthenticatedUIHandler {
  editAccountSelect(account: Account): void;
  addAccountSelect(proposals?: {[index: string]:string}): void;
}

interface IAppHandler {
  doLogout(): Promise<void>;
  showMessage(text: string, options: IMessageOptions): void;
}

export class PluginSystem {
  filterChangeHandler?: (filter: AccountsFilter) => void;
  filters: { [index: string]: AccountFilter } = {};
  filterPresent = false;
  
  authenticationProvider: Array<IAuthenticationProvider> = [];
  mainViewCallback: Array<() => JSX.Element | void> = [];
  resetFilterCallback: Array<() => void> = [];
  accountsReadyCallback: Array<(accounts: Array<Account>) => void> = [];
  passwordButtonCallback: Array<(account: Account) => void | JSX.Element > = [];
  accountButtonCallback: Array<(account: Account) => void | JSX.Element > = [];
  editInputButtonCallback: Array<(inputKey: string,  currentValue: string, setValue: (val: string) => void, account?: Account) => JSX.Element | void> = [];
  editPreShowCallback: Array<(fields: {[index: string]:string}, account?: Account) => void> = [];
  loginSuccessfulCallback: Array<(username: string, key: CryptoKey) => void> = [];
  loginViewReadyCallback: Array<() => void> = [];
  preLogoutCallback: Array<() => void> = [];
  accountListShortcutsCallback: Array<() => Array<BasePlugin.IPluginShortcut>> = [];
  authenticatedUIHandler?: IAuthenticatedUIHandler;
  appHandler?: IAppHandler;

  constructor (private backend: BackendService, private transformer: AccountTransformerService, public shortcuts: ShortcutManager, private debug: (msg: string) => void) {
    this.clearPlugins();
    this.backend.accountsObservable
      .subscribe((accounts: Array<Account>) => {
          this.accountsReady(accounts);
          });
    this.activatePlugins(activatedPlugins());
  }
  
  activatePlugins(plugins: Array<new (pluginSystem: PluginSystem) => BasePlugin.BasePlugin>): void {
    this.clearPlugins();
    for (const Plugin of plugins) {
      this.registerPlugin(new Plugin(this));
    }
  }

  clearPlugins(): void {
    this.mainViewCallback = [];
    this.resetFilterCallback = [];
    this.accountsReadyCallback = [];
    this.passwordButtonCallback = [];
    this.accountButtonCallback = [];
    this.editInputButtonCallback = [];
    this.editPreShowCallback = [];
    this.loginSuccessfulCallback = [];
    this.loginViewReadyCallback = [];
    this.preLogoutCallback = [];
  }

  registerPlugin(plugin: BasePlugin.BasePlugin): void {
    //requires
    if (BasePlugin.instanceOfIPluginRequiresTransformer(plugin)) {
      plugin.setTransformer(this.transformer);
    }
    if (BasePlugin.instanceOfIPluginRequiresDebug(plugin)) {
      plugin.setDebug(this.debug);
    }
    //callbacks
    if (BasePlugin.instanceOfIPluginWithMainView(plugin)) {
      this.mainViewCallback.push(plugin.MainViewJSX.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithFilter(plugin)) {
      this.resetFilterCallback.push(plugin.resetFilter.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithAccountsReady(plugin)) {
      this.accountsReadyCallback.push(plugin.accountsReady.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithPasswordButton(plugin)) {
      this.passwordButtonCallback.push(plugin.passwordButton.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithAccountButton(plugin)) {
      this.accountButtonCallback.push(plugin.accountButton.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithLoginSuccessful(plugin)) {
      this.loginSuccessfulCallback.push(plugin.loginSuccessful.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithPreLogout(plugin)) {
      this.preLogoutCallback.push(plugin.preLogout.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithLoginViewReady(plugin)) {
      this.loginViewReadyCallback.push(plugin.loginViewReady.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithEditInputButton(plugin)) {
      this.editInputButtonCallback.push(plugin.editInputButton.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithEditPreShow(plugin)) {
      this.editPreShowCallback.push(plugin.editPreShow.bind(plugin));
    }
    if (BasePlugin.instanceOfIPluginWithAccountListShortcuts(plugin)) {
      this.accountListShortcutsCallback.push(plugin.accountListShortcuts.bind(plugin));
    }
    if (instanceOfAuthenticationProvider(plugin)) {
      this.authenticationProvider.push(plugin);
    }
  }

  getAuthenticationProvider(): Array<IAuthenticationProvider> {
    return this.authenticationProvider;
  }

  registerAuthenticatedUIHandler(handler: IAuthenticatedUIHandler): void {
    this.authenticatedUIHandler = handler;
  }

  registerAppHandler(handler: IAppHandler): void {
    this.appHandler = handler;
  }
  
  getAccountByIndex(index: number): Account | undefined {
    return this.backend.accounts.find(account => account.index === index);
  }
  //callbacks from password manager

  accountsReady(accounts: Array<Account>): void {
    this.accountsReadyCallback.forEach(ready => ready(accounts));
  }

  loginSuccessful(username: string, key: CryptoKey): void {
    this.loginSuccessfulCallback.forEach(loginSuccessful => loginSuccessful(username, key));
  }

  preLogout(): void {
    this.preLogoutCallback.forEach(preLogout => preLogout());
  }

  loginViewReady(): void {
    this.loginViewReadyCallback.forEach(loginViewReady => loginViewReady());
  }
/*
  async callHook<InputData,OutputData=void>(data:InputData): Promise<OutputData> {
    return
  }*/

  // calling functions in UI through plugins:
 
  UIeditAccountSelect(account: Account): void {
    if (this.authenticatedUIHandler) {
      this.authenticatedUIHandler.editAccountSelect(account);
    }
  }

  UIaddAccountSelect(proposals?: {[index: string]:string}): void {
    if (this.authenticatedUIHandler) {
      this.authenticatedUIHandler.addAccountSelect(proposals);
    }
  }

  UIshowMessage(text: string, options: IMessageOptions = {}): void {
    if (this.appHandler) {
      this.appHandler.showMessage(text, options);
    }
  }

  // calling backend functions through plugins

  backendLogin(credentialProvider: ICredentialProvider, username?: string): Promise<ILogonInformation> {
    return this.backend.logonWithCredentials(credentialProvider, username);
  }
  
  logout(): void {
    if (this.appHandler) {
      this.appHandler.doLogout();
    }
  }

  // handling account filtering through plugins:

  setFilterChangeHandler(filterChangeHandler: (filter:AccountsFilter) => void): void {
    this.filterChangeHandler = filterChangeHandler;
    this.updateFilter();
  }

  setFilter(key: string, filter?: AccountFilter): void {
    this.filterPresent = true;
    if (filter === undefined) {
      delete this.filters[key];
    }
    else {
      this.filters[key] = filter;
    }
    this.updateFilter();
  }

  clearFilters(): void {
    this.filters = {};
    this.filterPresent = false;
    this.resetFilterCallback.forEach(reset => reset());
    this.updateFilter();
  }

  updateFilter(): void {
    this.filterPresent = Object.keys(this.filters).length > 0;
    if (!this.filterChangeHandler)
      return ;
    this.filterChangeHandler( (accounts: Array<Account>): Array<Account> => {
        return this.doFilter(accounts);
        });
  }

  private doFilter(accounts: Array<Account>): Array<Account> {
    let filtered = accounts;
    for (const key in this.filters) {
      filtered = filtered.filter( this.filters[key] );
    }
    return filtered;
  }

  /* filling UI elements in */

  getMainView(): Array<JSX.Element> {
    return this.mainViewCallback.map(view => view()).filter((button): button is JSX.Element => button !== undefined);
  }

  accountButtons(account: Account): Array<JSX.Element> {
    return this.accountButtonCallback.map(button => button(account)).filter((button): button is JSX.Element => button !== undefined);
  }

  passwordButtons(account: Account): Array<JSX.Element> {
    return this.passwordButtonCallback.map(button => button(account)).filter((button): button is JSX.Element => button !== undefined);
  }

  editInputButtons(inputKey: string, currentValue: string, setValue: (val: string) => void, account?: Account): Array<JSX.Element> {
    return this.editInputButtonCallback.map(button => button(inputKey, currentValue, setValue, account)).filter((button): button is JSX.Element => button !== undefined);
  }

  editPreShow(fields: {[index: string]:string}, account?: Account): void {
    this.editPreShowCallback.forEach(pluginCallback => pluginCallback(fields, account));
  }

  accountListShortcuts(): Array<BasePlugin.IPluginShortcut> {
    const reductor = (returnArray: Array<BasePlugin.IPluginShortcut>, callback: () => Array<BasePlugin.IPluginShortcut>): Array<BasePlugin.IPluginShortcut> => {
      returnArray.push(...callback());
      return returnArray;
    };
    return this.accountListShortcutsCallback.reduce<Array<BasePlugin.IPluginShortcut>>(reductor, []);
  }

}
