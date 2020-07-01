import { Account } from '../backend/models/account';
import { BackendService } from '../backend/backend.service';
import { ActivatedPlugins } from './ActivatedPlugins';
import { BasePlugin, instanceOfIPluginWithMainView, instanceOfIPluginWithFilter, instanceOfIPluginWithAccountsReady } from './BasePlugin';

export type AccountsFilter = (accounts: Array<Account>) => Array<Account>;
type AccountFilter = (account: Account) => boolean;


export class PluginSystem {
  filterChangeHandler?: (filter: AccountsFilter) => void;
  filters: { [index: string]: AccountFilter } = {};
  
  mainViewCallback: Array<() => JSX.Element> = [];
  resetFilterCallback: Array<() => void> = [];
  accountsReadyCallback: Array<(accounts: Array<Account>) => void> = [];

  constructor (private backend: BackendService) {
    this.backend.accountsObservable
      .subscribe((accounts: Array<Account>) => {
          this.accountsReady(accounts);
          });
    this.activatePlugins(ActivatedPlugins);
  }
  
  activatePlugins(plugins: Array<new (pluginSystem: PluginSystem) => BasePlugin>) {
    this.clearPlugins();
    for (let Plugin of plugins) {
      this.registerPlugin(new Plugin(this));
    }
  }

  clearPlugins() {
    this.mainViewCallback = [];
    this.resetFilterCallback = [];
    this.accountsReadyCallback = [];
  }

  registerPlugin(plugin: BasePlugin) {
    if (instanceOfIPluginWithMainView(plugin)) {
      this.mainViewCallback.push(plugin.MainViewJSX.bind(plugin));
    }
    if (instanceOfIPluginWithFilter(plugin)) {
      this.resetFilterCallback.push(plugin.resetFilter.bind(plugin));
    }
    if (instanceOfIPluginWithAccountsReady(plugin)) {
      this.accountsReadyCallback.push(plugin.accountsReady.bind(plugin));
    }
  }

  private accountsReady(accounts: Array<Account>) {
    this.accountsReadyCallback.forEach(ready => ready(accounts));
  }

/*
  async callHook<InputData,OutputData=void>(data:InputData): Promise<OutputData> {
    return
  }*/

  setFilterChangeHandler(filterChangeHandler: (filter:AccountsFilter) => void) {
    this.filterChangeHandler = filterChangeHandler;
    this.updateFilter();
  }

  setFilter(key: string, filter: AccountFilter) {
    this.filters[key] = filter;
    this.updateFilter();
  }

  clearFilters() {
    this.filters = {};
    this.resetFilterCallback.forEach(reset => reset());
    this.updateFilter();
  }

  updateFilter() {
    if (!this.filterChangeHandler)
      return ;
    this.filterChangeHandler( (accounts: Array<Account>): Array<Account> => {
        return this.doFilter(accounts);
        });
  }

  private doFilter(accounts: Array<Account>): Array<Account> {
    let filtered = accounts;
    for (let key in this.filters) {
      filtered = filtered.filter( this.filters[key] );
    }
    return filtered;
  }

  getMainView() {
    return this.mainViewCallback.map(view => view());
  }
}
