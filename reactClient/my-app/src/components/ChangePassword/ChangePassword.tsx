import React from 'react';
import styles from './ChangePassword.module.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PasswordInputWithToggle from '../PasswordInputWithToggle/PasswordInputWithToggle';
import Col from 'react-bootstrap/Col';

interface ChangePasswordProps {
  changePasswordHandler: (oldPassword: string, newPassword: string) => Promise<void>;
  showMessage: (message: string, important?: boolean, clickHandler?: () => void) => void
}
interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
}
interface ChangePasswordState extends ChangePasswordFormValues {
  waiting: boolean;
}

class ChangePassword extends React.Component<ChangePasswordProps, ChangePasswordState> {
  constructor(props: ChangePasswordProps) {
    super(props);
    this.state = { oldPassword: '', newPassword: '', newPassword2: '', waiting: false};
    this.handleGenericChange = this.handleGenericChange.bind(this);
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>) {
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
  render () {
    return (
	  <div className={styles.Login}>
      <Col lg={{ span: 2, offset: 5 }} md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
        <h2>ChangePassword</h2>
        <Form onSubmit={this.doChange.bind(this)}>
          <fieldset disabled={this.state.waiting}>
            <Form.Group controlId="changePwOldPassword">
              <Form.Label>Old Password</Form.Label>
              <PasswordInputWithToggle onChange={this.handleGenericChange} placeholder="Old Password" name="oldPassword" />
            </Form.Group>
            <Form.Group controlId="changePwNewPassword">
              <Form.Label>New Password</Form.Label>
              <PasswordInputWithToggle onChange={this.handleGenericChange} placeholder="New Password" name="newPassword" />
            </Form.Group>
            <Form.Group controlId="changePwNewPassword2">
              <Form.Label>Repeat new Password</Form.Label>
              <PasswordInputWithToggle onChange={this.handleGenericChange} placeholder="New Password (repeated)" name="newPassword2" />
            </Form.Group>
            <Button variant="primary" type="submit">Change Password</Button>
          </fieldset>
        </Form>
      </Col>
	  </div>
    );
  }
}

export default ChangePassword;
