import React from 'react';
import styles from './AccountList.module.css';
import AccountPasswordWithToggle from '../AccountPasswordWithToggle/AccountPasswordWithToggle';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { PluginSystem } from '../../plugin/PluginSystem';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
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
  columns: Array<IDataTableColumn>;
}
class AccountList extends React.Component<AccountListProps, AccountListState> {
  constructor(props: AccountListProps) {
    super(props);
    this.state = {
      columns: this.getColumns()
    }
  }
  componentDidUpdate(prevProps: AccountListProps): void {
    if (this.props.fields !== prevProps.fields) {
      this.getColumns();
      this.setState({columns: this.getColumns()});
    }
  }
  getTableActions(): JSX.Element {
    return <Button onClick={this.props.addAccountHandler} variant="success" size="sm" ><Plus/> Add Account</Button>
  }
  
  getAccountButtons(account: Account) {
    let buttons : Array <void | JSX.Element> = [<Button key="EditAccountNative" onClick={()=>{this.props.editAccountHandler(account)}}><Pencil/></Button>];
    buttons = this.props.pluginSystem.accountButtons(account).concat(buttons);
    return (
      <ButtonGroup size="sm" className={styles.TableButtonGroup}>
        {buttons}
      </ButtonGroup>
    )
  }
  
  getPasswordButtons(account: Account) {
    const buttons = this.props.pluginSystem.passwordButtons(account);
    return (
      <ButtonGroup size="sm" className={styles.TableButtonGroup}>
        {buttons}
      </ButtonGroup>
    )
  }
  
  getColumns(): Array<IDataTableColumn> {
    const columns: Array<IDataTableColumn> = [
      { 
        name: "Name", 
        selector: "name", 
        sortable:true,
        cell: (row: Account) => [<>{row.name}</>, this.getAccountButtons(row)]
      },
      { 
        name: "Password",  
        ignoreRowClick: true, 
        cell: (row: Account) => [ <AccountPasswordWithToggle account={row} getAccountPasswordHandler={this.props.getAccountPasswordHandler}/>, this.getPasswordButtons(row)]
      }
    ];
    const sortFunc = (a: FieldOptions, b: FieldOptions) => {
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
    for (const field of this.props.fields.sort(sortFunc)) {
      if (!field.visible) {
        continue;
      }
      const column: IDataTableColumn = {
          name: field.name, 
          selector: (row: Account) => row.other[field.selector],
          sortable: field.sortable,
          hide: field.hideInTable || 'md'
        };
      if (field.colNumber) {
        columns.splice(field.colNumber, 0, column);
      }
      else {
        columns.push(column);
      }
    }
    return columns;
  }
  render(): JSX.Element {
/*
    let accounts = this.props.accounts.map((item, key) =>
	<li key={item.index}>{item.name}</li>
	);*/
    return (
      <div className={styles.AccountList}>
        <DataTable title="Passwords" columns={this.state.columns} data={this.props.accounts} striped pagination actions={this.getTableActions()} />
      </div>
    );
  }
}

export default AccountList;
