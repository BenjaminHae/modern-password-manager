import React from 'react';
import { Account } from '../../backend/models/account';
import { BasePlugin, IPluginWithMainView, IPluginWithFilter, IPluginWithAccountsReady } from '../BasePlugin';
import { PluginSystem } from '../PluginSystem';
import TagViewComponent from './TagViewComponent/TagViewComponent';

export class TagsPlugin extends BasePlugin implements IPluginWithMainView, IPluginWithFilter, IPluginWithAccountsReady {
  tags: Array<string> = [];
  tagList = React.createRef<TagViewComponent>();

  constructor (protected pluginSystem: PluginSystem) {
    super(pluginSystem);
  }

  MainViewJSX(): JSX.Element | void {
    if (this.tags.length === 0)
      return
    return ( <TagViewComponent key="TagViewComponent" tags={this.tags} filterCallback={this.filterCallback.bind(this)} ref={this.tagList}/> );
  }

  resetFilter(): void {
    if (this.tagList.current) {
      this.tagList.current.clearSelected();
    }
  }

  accountsReady(accounts: Array<Account>): void {
    this.tags = this.gatherDistinctTags(accounts);
  }

  filterCallback(tagsFilter: Array<string>): void {
    let filter = undefined;
    if (tagsFilter.length > 0) {
      filter = (acc: Account): boolean=> {
        if (!("tags" in acc.other)) {
          return false;
        }
        const accTags = acc.other["tags"].split(',').map(function (str: string){return str.trim();});
        return tagsFilter.every(tag => accTags.includes(tag));
        }
    }
    this.pluginSystem.setFilter('tags', filter);
  }

  private gatherDistinctTags(accounts: Array<Account>) {
    let tags: Array<string> = [];
    for (const x of accounts) {
      if (!("tags" in x.other))
        continue;
      if (x.other["tags"].length>0)
        tags = tags.concat(x.other["tags"].split(',').map(function (str: string){return str.trim();}));
    }
    const unique: Array<string> = [];
    for (const tag of tags ) {
      if(! unique.includes(tag)) {
        unique.push(tag);
      }
    }
    return unique.sort(function (a: string, b: string) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
  }
}

