import React from 'react';
import styles from './Authenticated.module.css';
import { Account } from '../../backend/models/account';

interface AuthenticatedProps {
	accounts: Array<Account>;
}
interface AuthenticatedState {
}
class Authenticated extends React.Component<AuthenticatedProps, AuthenticatedState> {
  render () {
    return (
	  <div className={styles.Authenticated}>
	    Authenticated Component
	  </div>
	);
  }
}
export default Authenticated;
