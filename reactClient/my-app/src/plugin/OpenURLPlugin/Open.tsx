import React from 'react';
import { Account } from '../../backend/models/account';
import { BasePlugin, IPluginWithAccountButton } from '../BasePlugin';
import Button from 'react-bootstrap/Button';
import { Globe } from 'react-bootstrap-icons';

export default class OpenURLPlugin extends BasePlugin implements IPluginWithAccountButton {

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
    return (<Button key="OpenURLPlugin" variant="secondary" as="a" href={account.other.url} target="blank" rel="noopener noreferrer"><Globe/></Button>)
  }
}

