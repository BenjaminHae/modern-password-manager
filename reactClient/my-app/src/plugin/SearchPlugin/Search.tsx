import React from 'react';
import { Account } from '../../backend/models/account';
import { BasePlugin, IPluginWithFilter, IPluginWithMainView } from '../BasePlugin';
import SearchInputComponent from './SearchInputComponent';

export class SearchPlugin extends BasePlugin implements IPluginWithFilter, IPluginWithMainView {
  searchInput = React.createRef<SearchInputComponent>();

  MainViewJSX(): JSX.Element {
    return ( <SearchInputComponent filterCallback={this.filterCallback.bind(this)} ref={this.searchInput} /> );
  }
  
  resetFilter(): void {
    if (this.searchInput.current) {
      this.searchInput.current.clearInput();
    }
  }
 
  filterCallback(searchExpression: string): void {
    if (searchExpression !== "") {
      const filter = (acc: Account): boolean=> {
        if (acc.name.includes(searchExpression)) {
          return true;
        }
        for (const key in acc.other) {
          if (acc.other[key].includes(searchExpression))
            return true;
        }
        return false;
      }
      this.pluginSystem.setFilter('search', filter);
    }
    else {
      this.pluginSystem.setFilter('search', undefined);
    }
  }
}

