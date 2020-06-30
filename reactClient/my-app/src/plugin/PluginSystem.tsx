import { Account } from '../backend/models/account';

export type AccountsFilter = (accounts: Array<Account>) => Array<Account>;
type AccountFilter = (account: Account) => boolean;

export class PluginSystem {
  filterChangeHandler?: (filter: AccountsFilter) => void;
  filters: { [index: string]: AccountFilter; } = {};

  setFilterChangeHandler(filterChangeHandler: (filter:AccountsFilter) => void) {
    this.filterChangeHandler = filterChangeHandler;
    this.updateFilter();
  }

  registerPlugin() {
  }

/*
  async callHook<InputData,OutputData=void>(data:InputData): Promise<OutputData> {
    return
  }*/

  setFilter(key: string, filter: AccountFilter) {
    this.filters[key] = filter;
    this.updateFilter();
  }

  clearFilters() {
    this.filters = {};
    this.updateFilter();
  }

  updateFilter() {
    if (!this.filterChangeHandler)
      return ;
    this.filterChangeHandler( (accounts: Array<Account>): Array<Account> => {
        return this.doFilter(accounts);
        });
  }

  doFilter(accounts: Array<Account>): Array<Account> {
    let filtered = accounts;
    for (let key in this.filters) {
      filtered = filtered.filter( this.filters[key] );
    }
    return filtered;
  }

}
