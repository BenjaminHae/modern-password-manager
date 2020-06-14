import React from 'react';
import styles from './Unauthenticated.module.css';
import Login from '../Login/Login';
import Register from '../Register/Register';

interface UnauthenticatedProps {
  doLogin: (username: string, password: string) => void;
  doRegister: (username: string, password: string, email: string) => Promise<void>;
  showRegistration: boolean;
}
class Unauthenticated extends React.Component<UnauthenticatedProps> {
  render () {
    return (
      <div className={styles.Unauthenticated}>
        <Login doLogin={this.props.doLogin}/>
        {this.props.showRegistration && <Register doRegister={this.props.doRegister} /> }
      </div>
    )
  }
}

export default Unauthenticated;
