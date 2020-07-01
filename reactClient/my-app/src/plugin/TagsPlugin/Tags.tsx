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

  MainViewJSX() {
    return ( <TagViewComponent tags={this.tags} filterCallback={this.filterCallback.bind(this)} ref={this.tagList}/> );
  }

  resetFilter() {
    if (this.tagList.current) {
      this.tagList.current.clearSelected();
    }
  }

  accountsReady(accounts: Array<Account>) {
    this.tags = this.gatherDistinctTags(accounts);
  }

  filterCallback(tagsFilter: Array<string>) {
    this.pluginSystem.setFilter('tags', (acc: Account): boolean=> {
        if (!("tags" in acc.other)) {
          return false;
        }
        let accTags = acc.other["tags"].split(',').map(function (str: string){return str.trim();});
        return tagsFilter.every(tag => accTags.includes(tag));
        });
  }

  private gatherDistinctTags(accounts: Array<Account>) {
    var tags: Array<string> = [];
    for (let x of accounts) {
      if (!("tags" in x.other))
        continue;
      if (x.other["tags"].length>0)
        tags = tags.concat(x.other["tags"].split(',').map(function (str: string){return str.trim();}));
    }
    var unique: Array<string> = [];
    for (let tag of tags ) {
      if(! unique.includes(tag)) {
        unique.push(tag);
      }
    }
    return unique.sort(function (a: string, b: string) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
  }
}

