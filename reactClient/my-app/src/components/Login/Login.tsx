import React from 'react';
import styles from './Login.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import PasswordInputWithToggle from '../PasswordInputWithToggle/PasswordInputWithToggle';

interface LoginProps {
  doLogin: (username: string, password: string) => void;
}
interface LoginState {
  username: string;
  password: string;
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = { username: '', password: ''};
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.doLogon = this.doLogon.bind(this);
  }
  handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({username: event.target.value});
  }
  handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({password: event.target.value});
  }
  doLogon(event: React.FormEvent) {
    event.preventDefault();
    this.props.doLogin(this.state.username, this.state.password)
    this.setState({ password: "" });
  }
  render () {
    return (
	  <div className={styles.Login}>
      <Col lg={{ span: 2, offset: 5 }} md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
        <h2>Login</h2>
        <Form onSubmit={this.doLogon}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter Username" name="username" onChange={this.handleNameChange}/>
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <PasswordInputWithToggle onChange={this.handlePasswordChange} value={this.state.password} />
          </Form.Group>
          <Button variant="primary" type="submit">Login</Button>
        </Form>
      </Col>
    </div>
    );
  }
}

export default Login;
