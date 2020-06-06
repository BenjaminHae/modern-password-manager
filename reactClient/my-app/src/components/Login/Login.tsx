import React from 'react';
import styles from './Login.module.css';

interface LoginProps {
  doLogin: (username: string, password: string) => void;
}
interface LoginState {
  username: string;
  password: string;
  message: string;
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = { username: '', password: '', message: ""};
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
    this.props.doLogin(this.state.username, this.state.password)
    event.preventDefault();
  }
  render () {
    return (
	  <div className={styles.Login}>
	    Login Component
		<form onSubmit={this.doLogon}>
	      Login
	      <div>
		<div >
		    <label>Username
		    <input type="text" placeholder="Username" name="username" onChange={this.handleNameChange}/>
		    </label>
		</div>
	      </div>
	      <div>
		<div>
		    <label>Password
		    <input placeholder="Password" name="password" onChange={this.handlePasswordChange}/>
		    </label>
		</div>
	      </div>
	      <input color="primary" type="submit" value="Login"/>
	      <span>{this.state.message}</span>
	    </form>
	  </div>
    );
  }
}

export default Login;
