import React from 'react';
import styles from './ChangePassword.module.css';

interface ChangePasswordProps {
  changePasswordHandler: (oldPassword: string, newPassword: string) => Promise<void>;
}
interface ChangePasswordState {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
  message: string;
}

class ChangePassword extends React.Component<ChangePasswordProps, ChangePasswordState> {
  constructor(props: ChangePasswordProps) {
    super(props);
    this.state = { oldPassword: '', newPassword: '', newPassword2: '', message: ""};
    this.handleGenericChange = this.handleGenericChange.bind(this);
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name in this.state) {
      this.setState({[event.target.name]: event.target.value} as Partial<ChangePasswordState>);
    }
  }
  async doChange(event: React.FormEvent):Promise<void> {
    if (this.state.newPassword === this.state.newPassword2) {
      await this.props.changePasswordHandler(this.state.oldPassword, this.state.newPassword)
      this.state.message = "Successfully changed password";
    }
    else {
      this.state.message = "New Password and repeat do not match";
    }
    event.preventDefault();
  }
  render () {
    return (
	  <div className={styles.Login}>
		<form onSubmit={this.doChange}>
      <h2>Login</h2>
      <div>
        <div>
            <label>Username
            <input type="text" placeholder="Old Password" name="oldPassword" onChange={this.handleGenericChange}/>
            </label>
        </div>
      </div>
      <div>
        <div>
            <label>Password
            <input placeholder="New Password" name="newPassword" onChange={this.handleGenericChange}/>
            </label>
        </div>
      </div>
      <div>
        <div>
            <label>Password
            <input placeholder="New Password (repeated)" name="newPassword2" onChange={this.handleGenericChange}/>
            </label>
        </div>
      </div>
      <input color="primary" type="submit" value="Change Password"/>
      <span>{this.state.message}</span>
    </form>
	  </div>
    );
  }
}

export default ChangePassword;
