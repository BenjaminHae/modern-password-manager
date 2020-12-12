import React from 'react';
import { Account } from '../../backend/models/account';
import { BasePlugin, IPluginWithAccountButton, IPluginWithAccountListShortcuts, IPluginShortcut } from '../BasePlugin';
import Button from 'react-bootstrap/Button';
import { Globe } from 'react-bootstrap-icons';

export default class OpenURLPlugin extends BasePlugin implements IPluginWithAccountButton, IPluginWithAccountListShortcuts {

  private isSafe(url: string): boolean {
    try {
      const protocol = new URL(url).protocol;
      return (protocol === "https:");
    }
    catch {
      return false;
    }
  }
  accountButton(account: Account): void | JSX.Element{
    if (!account.other.url)
      return
    if (!this.isSafe(account.other.url))
      return
    return (<Button key="OpenURLPlugin" variant="secondary" as="a" href={account.other.url} target="_blank" rel="noopener noreferrer"><Globe/></Button>)
  }
  openWindow(account: Account) {
    if (!account.other.url)
      return
    if (!this.isSafe(account.other.url))
      return
    window.open(account.other.url, "_blank");
  }
  accountListShortcuts(): Array<IPluginShortcut> {
    return [{
      action: (account) => this.openWindow(account),
      shortcut: "o",
      description: "Open url of selected row"
      }]
  }
}

