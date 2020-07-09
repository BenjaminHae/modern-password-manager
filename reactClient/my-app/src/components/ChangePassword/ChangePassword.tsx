import React from 'react';
import styles from './ChangePassword.module.css';

interface ChangePasswordProps {
  changePasswordHandler: (oldPassword: string, newPassword: string) => Promise<void>;
  showMessage: (message: string, important?: boolean, clickHandler?: () => void) => void
}
interface ChangePasswordState {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
}

class ChangePassword extends React.Component<ChangePasswordProps, ChangePasswordState> {
  constructor(props: ChangePasswordProps) {
    super(props);
    this.state = { oldPassword: '', newPassword: '', newPassword2: ''};
    this.handleGenericChange = this.handleGenericChange.bind(this);
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name in this.state) {
      this.setState({[event.target.name]: event.target.value} as Pick<ChangePasswordState, keyof ChangePasswordState>);
    }
  }
  async doChange(event: React.FormEvent):Promise<void> {
    event.preventDefault();
    if (this.state.newPassword === this.state.newPassword2) {
      await this.props.changePasswordHandler(this.state.oldPassword, this.state.newPassword)
      this.props.showMessage("Successfully changed password");
    }
    else {
      this.props.showMessage("New Password and repeat do not match");
    }
  }
  render () {
    return (
	  <div className={styles.Login}>
		<form onSubmit={this.doChange.bind(this)}>
      <h2>ChangePassword</h2>
      <div>
        <div>
            <label>Old Password
            <input type="text" placeholder="Old Password" name="oldPassword" onChange={this.handleGenericChange}/>
            </label>
        </div>
      </div>
      <div>
        <div>
            <label>New Password
            <input placeholder="New Password" name="newPassword" onChange={this.handleGenericChange}/>
            </label>
        </div>
      </div>
      <div>
        <div>
            <label>Repeat new password
            <input placeholder="New Password (repeated)" name="newPassword2" onChange={this.handleGenericChange}/>
            </label>
        </div>
      </div>
      <input color="primary" type="submit" value="Change Password"/>
    </form>
	  </div>
    );
  }
}

export default ChangePassword;
