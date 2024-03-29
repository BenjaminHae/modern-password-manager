import React from 'react';
import styles from './Login.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PasswordInputWithToggle from '../PasswordInputWithToggle/PasswordInputWithToggle';

interface LoginProps {
  doLogin: (username: string, password: string) => Promise<void>;
  ready: boolean;
}
interface LoginFormValues {
  username: string;
  password: string;
}
interface LoginState extends LoginFormValues{
  waiting: boolean;
  validated: boolean;
}

class Login extends React.Component<LoginProps, LoginState> {
  readonly emptyInput = {
    username: "",
    password: "",
  }
  constructor(props: LoginProps) {
    super(props);
    this.state = { 
      ...this.emptyInput, 
      waiting: false,
      validated: false
    };
    this.handleGenericChange = this.handleGenericChange.bind(this);
    this.doLogon = this.doLogon.bind(this);
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.name in (this.state as LoginFormValues)) {
      this.setState({[event.target.name]: event.target.value} as Pick<LoginFormValues, keyof LoginFormValues>);
    }
  }
  async doLogon(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      this.setState({validated: true});
      return;
    }
    const password = this.state.password;
    this.setState({ password: "", waiting: true });
    await this.props.doLogin(this.state.username, password);
    this.setState({ waiting: false, validated: false });
  }
  render (): JSX.Element {
    return (
    <Form onSubmit={this.doLogon} noValidate validated={this.state.validated} className={styles.Login} >
      <fieldset disabled={this.state.waiting}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" autoFocus placeholder="Enter Username" name="username" onChange={this.handleGenericChange} required autoComplete="username" />
          <Form.Control.Feedback type="invalid">
            Username is required
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <PasswordInputWithToggle onChange={this.handleGenericChange} value={this.state.password} required autoComplete="current-password" />
          <Form.Control.Feedback type="invalid">
            Password is required
          </Form.Control.Feedback>
        </Form.Group>
        <Button disabled={!this.props.ready} variant="primary" type="submit">{ this.state.waiting || !this.props.ready ? "Wait" : "Login" }</Button>
      </fieldset>
    </Form>
    );
  }
}

export default Login;
