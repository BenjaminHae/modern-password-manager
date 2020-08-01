import React from 'react';
import styles from './AccountList.module.css';
import AccountPasswordWithToggle from '../AccountPasswordWithToggle/AccountPasswordWithToggle';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { PluginSystem } from '../../plugin/PluginSystem';
import Button from 'react-bootstrap/Button';
import { Plus, Pencil } from 'react-bootstrap-icons';


interface AccountListProps {
  accounts: Array<Account>;
  fields: Array<FieldOptions>;
  getAccountPasswordHandler: (account: Account) => Promise<string>;
  editAccountHandler: (account: Account) => void;
  addAccountHandler: () => void;
  pluginSystem: PluginSystem
}
interface AccountListState {
  columns: Array<IDataTableColumn<Account>>;
}
class AccountList extends React.Component<AccountListProps, AccountListState> {
  constructor(props: AccountListProps) {
    super(props);
    this.state = {
      columns: this.getColumns()
    }
  }
  componentDidUpdate(prevProps: AccountListProps) {
    if (this.props.fields !== prevProps.fields) {
      this.getColumns();
      this.setState({columns: this.getColumns()});
    }
  }
  getTableActions() {
    return <Button onClick={this.props.addAccountHandler} variant="success" size="sm" ><Plus/> Add Account</Button>
  }
  getColumns(): Array<IDataTableColumn<Account>> {
    let columns: Array<IDataTableColumn<Account>> = [
      { 
        name: "Name", 
        selector: "name", 
        sortable:true,
        cell: (row: Account) => <>{row.name} <Button size="sm" onClick={()=>{this.props.editAccountHandler(row)}}><Pencil/></Button></>
      },
      { 
        name: "Password",  
        ignoreOnRowClick: true, 
        cell: (row: Account) => <AccountPasswordWithToggle account={row} getAccountPasswordHandler={this.props.getAccountPasswordHandler}/> 
      }
    ];
    let sortFunc = (a: FieldOptions, b: FieldOptions) => {
      if (!a.colNumber) {
        if (!b.colNumber) {
          return 0;
        }
        return 1;
      }
      if (!b.colNumber) {
        return -1;
      }
      return a.colNumber - b.colNumber
    }
    for (let field of this.props.fields.sort(sortFunc)) {
      if (!field.visible) {
        continue;
      }
      let column: IDataTableColumn<Account> = {
          name: field.name, 
          selector: (row: Account) => row.other[field.selector],
          sortable: field.sortable
        };
      if (field.colNumber) {
        columns.splice(field.colNumber, 0, column);
      }
      else {
        columns.push(column);
      }
    }
    for (let column of columns) {
      column = this.props.pluginSystem.manipulateAccountListItem(column);
    }
    return columns;
  }
  handlePasswordShow() {
  }
  render () {
/*
    let accounts = this.props.accounts.map((item, key) =>
	<li key={item.index}>{item.name}</li>
	);*/
    return (
      <div className={styles.AccountList}>
        <DataTable title="Passwords" columns={this.state.columns} data={this.props.accounts} striped actions={this.getTableActions()} />
      </div>
    );
  }
}

export default AccountList;
