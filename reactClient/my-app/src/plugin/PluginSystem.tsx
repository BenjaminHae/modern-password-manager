import { Account } from '../backend/models/account';
import { BackendService } from '../backend/backend.service';
import { AccountTransformerService } from '../backend/controller/account-transformer.service';
import { ActivatedPlugins } from './ActivatedPlugins';
import { IDataTableColumn } from 'react-data-table-component';
import { BasePlugin, instanceOfIPluginWithMainView, instanceOfIPluginWithFilter, instanceOfIPluginWithAccountsReady, instanceOfIPluginWithAccountList, instanceOfIPluginWithPreLogout, instanceOfIPluginWithLoginSuccessful, instanceOfIPluginWithLoginViewReady, instanceOfIPluginRequiresTransformer } from './BasePlugin';

export type AccountsFilter = (accounts: Array<Account>) => Array<Account>;
type AccountFilter = (account: Account) => boolean;

export class PluginSystem {
  filterChangeHandler?: (filter: AccountsFilter) => void;
  filters: { [index: string]: AccountFilter } = {};
  filterPresent = false;
  
  mainViewCallback: Array<() => JSX.Element> = [];
  resetFilterCallback: Array<() => void> = [];
  accountsReadyCallback: Array<(accounts: Array<Account>) => void> = [];
  accountListCallback: Array<(column: IDataTableColumn) => IDataTableColumn> = [];
  loginSuccessfulCallback: Array<(username: string, key: any) => void> = [];
  loginViewReadyCallback: Array<() => void> = [];
  preLogoutCallback: Array<() => void> = [];

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
    if (instanceOfIPluginWithAccountList(plugin)) {
      this.accountListCallback.push(plugin.accountList.bind(plugin));
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

  getMainView(): Array<JSX.Element> {
    return this.mainViewCallback.map(view => view());
  }

  manipulateAccountListItem(column: IDataTableColumn): IDataTableColumn {
    let result = column;
    for (const callback of this.accountListCallback) {
      result = callback(result);
    }
    return result;
  }
}
