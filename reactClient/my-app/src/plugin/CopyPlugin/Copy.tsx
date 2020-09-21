import React from 'react';
import { Account } from '../../backend/models/account';
import { AccountTransformerService } from '../../backend/controller/account-transformer.service';
import { BasePlugin, IPluginWithPasswordButton, IPluginRequiresTransformer } from '../BasePlugin';
import Button from 'react-bootstrap/Button';
import { ClipboardData } from 'react-bootstrap-icons';

export class CopyPlugin extends BasePlugin implements IPluginWithPasswordButton, IPluginRequiresTransformer {
  transformer?: AccountTransformerService;
 
  setTransformer(transformer: AccountTransformerService): void {
    this.transformer = transformer;
  }
  passwordButton(account: Account): void | JSX.Element{
    if(!navigator.clipboard) {
      return;
    }
    return (<Button onClick={() => this.copyPassword(account)}><ClipboardData/></Button>)
  }
  async copyPassword(account: Account):Promise<void> {
    if (!this.transformer)
      return;
    navigator.clipboard.writeText(await this.transformer.getPassword(account))
  }
}

