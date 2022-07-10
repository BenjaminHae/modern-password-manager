import React from 'react';
import styles from './Register.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { IMessageOptions } from '../../libs/MessageManager';
import PasswordInputWithToggle from '../PasswordInputWithToggle/PasswordInputWithToggle';

interface RegisterProps {
  doRegister: (username: string, password: string, email: string) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
}

interface RegisterFormValues {
  username: string;
  password: string;
  password2: string;
  email: string;
}
interface RegisterState extends RegisterFormValues {
  waiting: boolean;
  validated: boolean;
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
      waiting: false,
      validated: false,
    }
    this.handleGenericChange = this.handleGenericChange.bind(this);
  }
  async doRegister(): Promise<void> {
    try {
      const password = this.state.password;
      this.setState({ waiting: true, password: "", password2: "" });
      await this.props.doRegister(this.state.username, password, this.state.email);
      this.setState({ 
        ...this.emptyInput,
        validated: false,
        waiting: false
      });
      this.props.showMessage("Registered successfully, please log in");
    }
    catch(e) {
      this.setState({ waiting: false });
      if (e instanceof Error) {
        this.props.showMessage("Registration failed: " + e.toString(), { autoClose: false, variant: "danger" } );
      }
      else {
        this.props.showMessage("Registration failed: " + e, { autoClose: false, variant: "danger" } );
      }
    }
  }
  async submitForm(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      this.setState({validated: true});
      return
    }
    this.setState({validated: true});
    if (this.state.password !== this.state.password2) {
      this.props.showMessage("Password repeat must match password", { autoClose: false, variant: "danger" });
      return
    }
    await this.doRegister();
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.name in (this.state as RegisterFormValues)) {
      this.setState({[event.target.name]: event.target.value} as Pick<RegisterFormValues, keyof RegisterFormValues>);
    }
  }
  render (): JSX.Element {
    return (
    <Form onSubmit={this.submitForm.bind(this)} noValidate validated={this.state.validated} className={styles.Register} >
      <fieldset disabled={this.state.waiting}>
        <Form.Group controlId="registerFormUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter Username" name="username" onChange={this.handleGenericChange} value={this.state.username} required/>
          <Form.Control.Feedback type="invalid">
            Username is required
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="registerFormEmail">
          <Form.Label>E-Mail</Form.Label>
          <Form.Control type="email" placeholder="Enter E-Mail-Address" name="email" onChange={this.handleGenericChange} value={this.state.email} required/>
          <Form.Control.Feedback type="invalid">
            Email is required
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="registerFormPassword">
          <Form.Label>Password</Form.Label>
          <PasswordInputWithToggle onChange={this.handleGenericChange} value={this.state.password} required/>
          <Form.Control.Feedback type="invalid">
            Password is required
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="registerFormPassword2">
          <Form.Label>Password</Form.Label>
          <PasswordInputWithToggle placeholder="New Password (repeated)" name="password2" onChange={this.handleGenericChange} value={this.state.password2} required/>
          <Form.Control.Feedback type="invalid">
            Password repeat is required
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">{ this.state.waiting ? "Wait" : "Register" }</Button>
      </fieldset>
    </Form>
    )
  }
}

export default Register;
