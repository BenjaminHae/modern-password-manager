import React from 'react';
import styles from './PasswordWithToggle.module.css';
import { Account } from '../../backend/models/account';

interface PasswordProps {
	account: Account;
}
class PasswordWithToggle extends React.Component<PasswordProps> {
  render () {
	return (
  <div className={styles.PasswordWithToggle}>
    PasswordWithToggle Component
  </div>
  )
  }
}

export default PasswordWithToggle;
