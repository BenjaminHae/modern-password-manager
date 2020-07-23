import React from 'react';
import styles from './Register.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import PasswordInputWithToggle from '../PasswordInputWithToggle/PasswordInputWithToggle';

// Todo:
//  - add second password input
interface RegisterProps {
  doRegister: (username: string, password: string, email: string) => Promise<void>;
  showMessage: (message: string, important?: boolean, clickHandler?: () => void) => void;
}

interface RegisterFormValues {
  username: string;
  password: string;
  password2: string;
  email: string;
}
interface RegisterState extends RegisterFormValues {
  waiting: boolean;
}


class Register extends React.Component<RegisterProps, RegisterState> {
  readonly emptyInput = {
    username: "",
    password: "",
    password2: "",
    email: "",
  }
  constructor(props: RegisterProps) {
    super(props);
    this.state = {
      ...this.emptyInput,
      waiting: false
    }
    this.handleGenericChange = this.handleGenericChange.bind(this);
  }
  async doRegister(event: React.FormEvent) {
    try {
      event.preventDefault();
      let password = this.state.password;
      this.setState({ waiting: true, password: "" });
      await this.props.doRegister(this.state.username, password, this.state.email);
      this.setState({ 
        ...this.emptyInput,
        waiting: false
      });
      this.props.showMessage("Registered successfully, please log in");
    }
    catch(e) {
      this.setState({ waiting: false });
      this.props.showMessage("Registration failed: " + e.toString(), true);
    }
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name in (this.state as RegisterFormValues)) {
      this.setState({[event.target.name]: event.target.value} as Pick<RegisterFormValues, keyof RegisterFormValues>);
    }
  }
  render () {
    return (
	  <div className={styles.Register}>
      <Col lg={{ span: 2, offset: 5 }} md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
	    <h2>Register</h2>
	    <Form onSubmit={this.doRegister.bind(this)}>
        <fieldset disabled={this.state.waiting}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter Username" name="username" onChange={this.handleGenericChange} value={this.state.username} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>E-Mail</Form.Label>
            <Form.Control type="text" placeholder="Enter E-Mail-Address" name="email" onChange={this.handleGenericChange} value={this.state.email}/>
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <PasswordInputWithToggle onChange={this.handleGenericChange} value={this.state.password} />
          </Form.Group>
          <Button variant="primary" type="submit">{ this.state.waiting ? "Wait" : "Register" }</Button>
        </fieldset>
      </Form>
      </Col>
    </div>
    )
  }
}

export default Register;
