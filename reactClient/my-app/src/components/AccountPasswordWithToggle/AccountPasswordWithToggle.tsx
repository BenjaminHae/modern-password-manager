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
  componentDidUpdate(prevProps: PasswordProps, prevState: PasswordState): void {
    if (this.state.visible !== prevState.visible) {
      if (this.state.visible) {
        this.getPassword();
      }
      else {
        this.clearPassword();
      }
    }
  }
  render (): JSX.Element {
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
  async getPassword(): Promise<void> {
    this.setState({password: await this.props.getAccountPasswordHandler(this.props.account)});
  }
  clearPassword(): void {
    this.setState({password: ""});
  }
  show(): void {
    this.setState({visible: true});
  }
  hide(): void {
    this.setState({visible: false});
  }
}

export default AccountPasswordWithToggle;
