import React from 'react';
import styles from './PasswordWithToggle.module.css';
import { Account } from '../../backend/models/account';
import { AccountTransformerService } from '../../backend/controller/account-transformer.service';
import Button from 'react-bootstrap/Button';

interface PasswordProps {
	account: Account;
	transformer: AccountTransformerService;
}
interface PasswordState {
	password: string;
	visible: boolean;
}
const HiddenPassword = "******";
class PasswordWithToggle extends React.Component<PasswordProps, PasswordState> {
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
    <React.Fragment>
    { !this.state.visible ?
	 <Button onClick={this.show}>{HiddenPassword}</Button>
     : <div><span>{this.state.password}</span>
	 <Button onClick={this.hide}>Hide</Button></div>
    }
    </React.Fragment>
  )
  }
  getPassword() {
    this.props.transformer.getPassword(this.props.account)
      .then((password) => {
	this.setState({password: password});
      });
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

export default PasswordWithToggle;
