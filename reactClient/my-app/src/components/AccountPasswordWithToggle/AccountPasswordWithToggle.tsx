import React from 'react';
import styles from './AccountPasswordWithToggle.module.css';
import { Account } from '../../backend/models/account';
import Button from 'react-bootstrap/Button';
import { EyeSlash } from 'react-bootstrap-icons';

interface PasswordProps {
	account: Account;
  getAccountPasswordHandler: (account: Account) => Promise<string>;
}
interface PasswordState {
	password: string;
	visible: boolean;
}
const HiddenPassword = "******";
class AccountPasswordWithToggle extends React.Component<PasswordProps, PasswordState> {
  constructor(props: PasswordProps) {
    super(props);
    this.state = {
      password: "",
      visible: false
    };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }
  componentDidUpdate(prevProps: PasswordProps, prevState: PasswordState) {
    if (this.state.visible !== prevState.visible) {
      if (this.state.visible) {
        this.getPassword();
      }
      else {
        this.clearPassword();
      }
    }
  }
  render () {
    return (
      <>
      { !this.state.visible ?
        <span onClick={this.show} >{HiddenPassword}</span>
        : <><span>{this.state.password}</span>
        <Button className={styles.Authenticated} onClick={this.hide} size="sm"><EyeSlash/></Button></>
      }
      </>
    )
  }
  async getPassword() {
    this.setState({password: await this.props.getAccountPasswordHandler(this.props.account)});
  }
  clearPassword() {
    this.setState({password: ""});
  }
  show() {
    this.setState({visible: true});
  }
  hide() {
    this.setState({visible: false});
  }
}

export default AccountPasswordWithToggle;
