import React from 'react';
import styles from './ChangePassword.module.css';
import { IMessageOptions } from '../Message/Message';
import PasswordInputWithToggle from '../PasswordInputWithToggle/PasswordInputWithToggle';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export interface IChangePasswordProps {
  changePasswordHandler: (oldPassword: string, newPassword: string) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
}
interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
}
interface ChangePasswordState extends ChangePasswordFormValues {
  waiting: boolean;
}

class ChangePassword extends React.Component<IChangePasswordProps, ChangePasswordState> {
  constructor(props: IChangePasswordProps) {
    super(props);
    this.state = { oldPassword: '', newPassword: '', newPassword2: '', waiting: false};
    this.handleGenericChange = this.handleGenericChange.bind(this);
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.name in (this.state as ChangePasswordFormValues)) {
      this.setState({[event.target.name]: event.target.value} as Pick<ChangePasswordFormValues, keyof ChangePasswordFormValues>);
    }
  }
  async doChange(event: React.FormEvent):Promise<void> {
    event.preventDefault();
    if (this.state.newPassword === this.state.newPassword2) {
      try {
        this.setState({waiting: true});
        await this.props.changePasswordHandler(this.state.oldPassword, this.state.newPassword)
        this.props.showMessage("Successfully changed password");
        this.setState({ oldPassword: '', newPassword: '', newPassword2: ''});
      }
      catch {
        this.props.showMessage("There was an error when changing passwords");
      }
      finally {
        this.setState({waiting: false});
      }
    }
    else {
      this.props.showMessage("New Password and repeat do not match");
    }
  }
  render (): JSX.Element {
    return (
    <div className={styles.Login}>
        <Form onSubmit={this.doChange.bind(this)}>
          <fieldset disabled={this.state.waiting}>
            <Form.Group controlId="changePwOldPassword">
              <Form.Label>Old Password</Form.Label>
              <PasswordInputWithToggle autoFocus={true} onChange={this.handleGenericChange} placeholder="Old Password" name="oldPassword" value={this.state.oldPassword} />
            </Form.Group>
            <Form.Group controlId="changePwNewPassword">
              <Form.Label>New Password</Form.Label>
              <PasswordInputWithToggle onChange={this.handleGenericChange} placeholder="New Password" name="newPassword" value={this.state.newPassword} />
            </Form.Group>
            <Form.Group controlId="changePwNewPassword2">
              <Form.Label>Repeat new Password</Form.Label>
              <PasswordInputWithToggle onChange={this.handleGenericChange} placeholder="New Password (repeated)" name="newPassword2" value={this.state.newPassword2} />
            </Form.Group>
            <Button variant="primary" type="submit">Change Password</Button>
          </fieldset>
        </Form>
    </div>
    );
  }
}

export default ChangePassword;
