import React from 'react';
import { Account } from '../backend/models/account';
import { BackendService } from '../backend/backend.service';

export type AccountsFilter = (accounts: Array<Account>) => Array<Account>;
type AccountFilter = (account: Account) => boolean;

export interface IPluginWithMainView {
  MainViewJSX: () => JSX.Element;
}

function instanceOfIPluginWithMainView(object: any): object is IPluginWithMainView {
  return 'MainViewJSX' in object;
}

export interface IPluginWithFilter {
  resetFilter: () => void;
}

function instanceOfIPluginWithFilter(object: any): object is IPluginWithFilter {
  return 'resetFilter' in object;
}

export interface IPluginWithAccountsReady {
  accountsReady: (accounts: Array<Account>) => void;
}

function instanceOfIPluginWithAccountsReady(object: any): object is IPluginWithAccountsReady {
  return 'accountsReady' in object;
}

export abstract class BasePlugin {
}

export class PluginSystem {
  backend: BackendService;
  filterChangeHandler?: (filter: AccountsFilter) => void;
  filters: { [index: string]: AccountFilter } = {};
  
  mainViewCallback: Array<() => JSX.Element> = [];
  resetFilterCallback: Array<() => void> = [];
  accountsReadyCallback: Array<(accounts: Array<Account>) => void> = [];

  constructor (backend: BackendService) {
    this.backend = backend;
    this.backend.accountsObservable
      .subscribe((accounts: Array<Account>) => {
          this.accountsReady(accounts);
          });
  }

  registerPlugin(plugin: BasePlugin) {
    if (instanceOfIPluginWithMainView(plugin)) {
      this.mainViewCallback.push(plugin.MainViewJSX);
    }
    if (instanceOfIPluginWithFilter(plugin)) {
      this.resetFilterCallback.push(plugin.resetFilter);
    }
    if (instanceOfIPluginWithAccountsReady(plugin)) {
      this.accountsReadyCallback.push(plugin.accountsReady);
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
