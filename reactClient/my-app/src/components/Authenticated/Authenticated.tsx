import React from 'react';
import styles from './Authenticated.module.css';
import { Account } from '../../backend/models/account';
import AccountList from '../AccountList/AccountList';

interface AuthenticatedProps {
	accounts: Array<Account>;
}
interface AuthenticatedState {
}
class Authenticated extends React.Component<AuthenticatedProps, AuthenticatedState> {
  render () {
    let accounts = this.props.accounts.map((item, key) =>
	<li key={item.index}>{item.name}</li>
	);
    return (
	  <div className={styles.Authenticated}>
	    Authenticated Component
		<AccountList accounts={this.props.accounts} />
	  </div>
	);
  }
}
export default Authenticated;
