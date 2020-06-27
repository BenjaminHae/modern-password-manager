import React from 'react';
import styles from './AccountList.module.css';
import PasswordWithToggle from '../PasswordWithToggle/PasswordWithToggle';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import { AccountTransformerService } from '../../backend/controller/account-transformer.service';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import Button from 'react-bootstrap/Button';


interface AccountListProps {
  accounts: Array<Account>;
  fields: Array<FieldOptions>;
  transformer: AccountTransformerService;
  editAccountHandler: (account: Account) => void;
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
      console.log(this.props.fields);
      this.getColumns();
      this.setState({columns: this.getColumns()});
    }
  }
  getColumns(): Array<IDataTableColumn<Account>> {
    let columns: Array<IDataTableColumn<Account>> = [
      { 
        name: "Name", 
        selector: "name", 
        sortable:true,
        cell: (row: Account) => <span>{row.name} <Button onClick={()=>{this.props.editAccountHandler(row)}}>edit</Button></span>
      },
      { 
        name: "Password",  
        ignoreOnRowClick: true, 
        cell: (row: Account) => <PasswordWithToggle account={row} transformer={this.props.transformer}/> 
      }
    ];
    let sortFunc = (a: FieldOptions, b: FieldOptions) => {
      if (!a.colNumber) {
        return 1;
      }
      if (!b.colNumber) {
        return -1;
      }
      return a.colNumber - b.colNumber
    }
    for (let field of this.props.fields.sort(sortFunc)) {
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
	<DataTable title="Passwords" columns={this.state.columns} data={this.props.accounts} />
  </div>
	);
  }
}

export default AccountList;
