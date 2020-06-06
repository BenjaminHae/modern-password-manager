import React from 'react';
import styles from './Register.module.css';
import Button from 'react-bootstrap/Button';

interface RegisterProps {
  doRegister: (username: string, password: string, email: string) => Promise<void>;
}
interface RegisterState {
  values: {[index: string]:string};
  message: string;
}


class Register extends React.Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props);
    this.state = {
      values: {username:  "", password:  "", email:  ""},
      message:  ""
    }
    this.handleGenericChange = this.handleGenericChange.bind(this);
  }
  doRegister() {
    this.props.doRegister(this.state.values.username, this.state.values.password, this.state.values.email);
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newValues = this.state.values;
    newValues[event.target.name] = event.target.value;
    this.setState({ values: newValues });
  }
  render () {
    return (
	  <div>
	    <h2>Registration</h2>
	    <form onSubmit={this.doRegister}>
	      <div>
		<div >
		    <label>Username
		    <input type="text" placeholder="Username" name="username" onChange={this.handleGenericChange}/>
		    </label>
		</div>
	      </div>
	      <div>
		<div>
		    <label>E-Mail
		    <input placeholder="you@domain.com" name="email" onChange={this.handleGenericChange}/>
		    </label>
		</div>
	      </div>
	      <div>
		<div>
		    <label>Password
		    <input placeholder="Password" name="password" onChange={this.handleGenericChange}/>
		    </label>
		</div>
	      </div>
        <span> <Button onClick={() => {this.doRegister()} }>register</Button></span>
	      <span>{this.state.message}</span>
	    </form>
        </div>
    )
  }
}

export default Register;
