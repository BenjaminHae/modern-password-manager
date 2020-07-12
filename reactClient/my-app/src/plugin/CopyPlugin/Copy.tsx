import React from 'react';
import { Account } from '../../backend/models/account';
import { AccountTransformerService } from '../../backend/controller/account-transformer.service';
import { BasePlugin, IPluginWithAccountList, IPluginRequiresTransformer } from '../BasePlugin';
import { IDataTableColumn } from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import { ClipboardData } from 'react-bootstrap-icons';

export class CopyPlugin extends BasePlugin implements IPluginWithAccountList, IPluginRequiresTransformer {
  transformer?: AccountTransformerService;
 
  setTransformer(transformer: AccountTransformerService) {
    this.transformer = transformer;
  }
  accountList(column: IDataTableColumn<Account>): IDataTableColumn<Account> {
    if (column.name === "Password") {
      if (column.cell !== undefined) {
        let oldCell = column.cell;
        column.cell = (row: Account) => {
          return [oldCell(row),this.showCopyPassword(row)]
        }
      }
      else {
        return (row: Account) => this.showCopyPassword(row)
      }
    }
    return column;
  }
  showCopyPassword(account: Account) {
    if(!navigator.clipboard) {
      return;
    }
    return (<Button onClick={() => this.copyPassword(account)} size="sm"><ClipboardData/></Button>)
  }
  async copyPassword(account: Account) {
    if (!this.transformer)
      return;
    navigator.clipboard.writeText(await this.transformer.getPassword(account))
  }
}

