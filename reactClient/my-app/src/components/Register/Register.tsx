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
}
interface RegisterState {
  values: {[index: string]:string};
}


class Register extends React.Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props);
    this.state = {
      values: {username:  "", password:  "", email:  ""},
    }
    this.handleGenericChange = this.handleGenericChange.bind(this);
  }
  doRegister(event: React.FormEvent) {
    event.preventDefault();
    this.props.doRegister(this.state.values.username, this.state.values.password, this.state.values.email);
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newValues = this.state.values;
    newValues[event.target.name] = event.target.value;
    this.setState({ values: newValues });
  }
  render () {
    return (
	  <div className={styles.Register}>
      <Col lg={{ span: 2, offset: 5 }} md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
	    <h2>Register</h2>
	    <Form onSubmit={this.doRegister.bind(this)}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter Username" name="username" onChange={this.handleGenericChange}/>
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>E-Mail</Form.Label>
            <Form.Control type="text" placeholder="Enter E-Mail-Address" name="email" onChange={this.handleGenericChange}/>
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <PasswordInputWithToggle onChange={this.handleGenericChange} />
          </Form.Group>
        <Button variant="primary" type="submit">Register</Button>
      </Form>
      </Col>
    </div>
    )
  }
}

export default Register;
