import { Account } from '../backend/models/account';
import { BackendService } from '../backend/backend.service';
import { ICredentialProvider } from '../backend/controller/credentialProvider';
import { AccountTransformerService } from '../backend/controller/account-transformer.service';
import { ActivatedPlugins } from './ActivatedPlugins';
import { BasePlugin, instanceOfIPluginWithMainView, instanceOfIPluginWithFilter, instanceOfIPluginWithAccountsReady, instanceOfIPluginWithAccountButton, instanceOfIPluginWithPasswordButton, instanceOfIPluginWithPreLogout, instanceOfIPluginWithLoginSuccessful, instanceOfIPluginWithLoginViewReady, instanceOfIPluginRequiresTransformer } from './BasePlugin';
import { IMessageOptions } from '../components/Message/Message';

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
  
  mainViewCallback: Array<() => JSX.Element> = [];
  resetFilterCallback: Array<() => void> = [];
  accountsReadyCallback: Array<(accounts: Array<Account>) => void> = [];
  passwordButtonCallback: Array<(account: Account) => void | JSX.Element > = [];
  accountButtonCallback: Array<(account: Account) => void | JSX.Element > = [];
  loginSuccessfulCallback: Array<(username: string, key: any) => void> = [];
  loginViewReadyCallback: Array<() => void> = [];
  preLogoutCallback: Array<() => void> = [];
  authenticatedUIHandler?: IAuthenticatedUIHandler;
  appHandler?: IAppHandler;

  constructor (private backend: BackendService, private transformer: AccountTransformerService) {
    this.backend.accountsObservable
      .subscribe((accounts: Array<Account>) => {
          this.accountsReady(accounts);
          });
    this.activatePlugins(ActivatedPlugins);
  }
  
  activatePlugins(plugins: Array<new (pluginSystem: PluginSystem) => BasePlugin>): void {
    this.clearPlugins();
    for (const Plugin of plugins) {
      this.registerPlugin(new Plugin(this));
    }
  }

  clearPlugins(): void {
    this.mainViewCallback = [];
    this.resetFilterCallback = [];
    this.accountsReadyCallback = [];
  }

  registerPlugin(plugin: BasePlugin): void {
    //requires
    if (instanceOfIPluginRequiresTransformer(plugin)) {
      plugin.setTransformer(this.transformer);
    }
    //callbacks
    if (instanceOfIPluginWithMainView(plugin)) {
      this.mainViewCallback.push(plugin.MainViewJSX.bind(plugin));
    }
    if (instanceOfIPluginWithFilter(plugin)) {
      this.resetFilterCallback.push(plugin.resetFilter.bind(plugin));
    }
    if (instanceOfIPluginWithAccountsReady(plugin)) {
      this.accountsReadyCallback.push(plugin.accountsReady.bind(plugin));
    }
    if (instanceOfIPluginWithPasswordButton(plugin)) {
      this.passwordButtonCallback.push(plugin.passwordButton.bind(plugin));
    }
    if (instanceOfIPluginWithAccountButton(plugin)) {
      this.accountButtonCallback.push(plugin.accountButton.bind(plugin));
    }
    if (instanceOfIPluginWithLoginSuccessful(plugin)) {
      this.loginSuccessfulCallback.push(plugin.loginSuccessful.bind(plugin));
    }
    if (instanceOfIPluginWithPreLogout(plugin)) {
      this.preLogoutCallback.push(plugin.preLogout.bind(plugin));
    }
    if (instanceOfIPluginWithLoginViewReady(plugin)) {
      this.loginViewReadyCallback.push(plugin.loginViewReady.bind(plugin));
    }
  }

  registerAuthenticatedUIHandler(handler: IAuthenticatedUIHandler) {
    this.authenticatedUIHandler = handler;
  }

  registerAppHandler(handler: IAppHandler) {
    this.appHandler = handler;
  }
  
  getAccountByIndex(index: number): Account | undefined {
    return this.backend.accounts.find(account => account.index === index);
  }
  //callbacks from password manager

  accountsReady(accounts: Array<Account>): void {
    this.accountsReadyCallback.forEach(ready => ready(accounts));
  }

  loginSuccessful(username: string, key: any) {
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

  backendLogin(credentialProvider: ICredentialProvider, username?: string): void {
    this.backend.logonWithCredentials(credentialProvider, username);
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
    return this.mainViewCallback.map(view => view());
  }

  accountButtons(account: Account): Array<void | JSX.Element> {
    return this.accountButtonCallback.map(button => button(account));
  }

  passwordButtons(account: Account): Array<void | JSX.Element> {
    return this.passwordButtonCallback.map(button => button(account));
  }

}
