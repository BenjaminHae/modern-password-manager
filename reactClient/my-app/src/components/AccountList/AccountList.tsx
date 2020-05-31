import React from 'react';
import styles from './AccountList.module.css';
import PasswordWithToggle from '../PasswordWithToggle/PasswordWithToggle';
import { Account } from '../../backend/models/account';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import Button from 'react-bootstrap/Button';


interface AccountListProps {
	accounts: Array<Account>;
}
class AccountList extends React.Component<AccountListProps> {
  columns: Array<IDataTableColumn<Account>>;
  constructor(props: AccountListProps) {
    super(props);
    this.columns = [{ name: "Name", selector: "name", sortable:true,},
			{ name: "Password", ignoreOnRowClick: true, button: true, cell: (row) => <PasswordWithToggle account={row}/> }];
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
	<DataTable title="Passwords" columns={this.columns} data={this.props.accounts} />
    AccountList Component
  </div>
	);
  }
}

export default AccountList;
