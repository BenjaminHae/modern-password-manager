import React from 'react';
import { Account } from '../../backend/models/account';
import { AccountTransformerService } from '../../backend/controller/account-transformer.service';
import { BasePlugin, IPluginWithPasswordButton, IPluginWithAccountListShortcuts, IPluginRequiresTransformer, IPluginShortcut } from '../BasePlugin';
import Button from 'react-bootstrap/Button';
import { ClipboardData } from 'react-bootstrap-icons';

export class CopyPlugin extends BasePlugin implements IPluginWithPasswordButton, IPluginWithAccountListShortcuts, IPluginRequiresTransformer {
  transformer?: AccountTransformerService;
  timeout?: ReturnType<typeof setTimeout>;
 
  setTransformer(transformer: AccountTransformerService): void {
    this.transformer = transformer;
  }
  passwordButton(account: Account): void | JSX.Element{
    if(!navigator.clipboard) {
      return;
    }
    return (<Button key="CopyPlugin" onClick={() => this.copyPassword(account)}><ClipboardData/></Button>)
  }
  async copyPassword(account: Account): Promise<void> {
    if (!this.transformer)
      return;
    // at first set the timeout to make sure the clipboard is cleared afterwards, this will fail if the password manager is not focues
    if(this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(function() {
      navigator.clipboard.writeText("");
    }, 15000);
    // copy the password to the clipboard
    navigator.clipboard.writeText(await this.transformer.getPassword(account))
    this.pluginSystem.UIshowMessage(`Password for Account "${account.name}"copied to clipboard`, {variant: "success"});
  }

  accountListShortcuts(): Array<IPluginShortcut> {
    return [{
      action: (account) => this.copyPassword(account),
      shortcut: "c",
      description: "Copy password of selected row to clipboard"
      }]
  }
}

