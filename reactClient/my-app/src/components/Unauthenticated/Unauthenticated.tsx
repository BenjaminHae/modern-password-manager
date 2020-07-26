import React from 'react';
import styles from './Unauthenticated.module.css';
import Login from '../Login/Login';
import Register from '../Register/Register';
import { IMessageOptions } from '../Message/Message';

interface UnauthenticatedProps {
  doLogin: (username: string, password: string) => void;
  doRegister: (username: string, password: string, email: string) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
  showRegistration: boolean;
  ready: boolean;
}
class Unauthenticated extends React.Component<UnauthenticatedProps> {
  render () {
    return (
      <div className={styles.Unauthenticated}>
          <Login doLogin={this.props.doLogin} ready={this.props.ready}/>
        {this.props.showRegistration && 
            <Register 
              doRegister={this.props.doRegister} 
              showMessage={this.props.showMessage}
            />
        }
      </div>
    )
  }
}

export default Unauthenticated;
