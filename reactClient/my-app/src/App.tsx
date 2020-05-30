import React from 'react';
import Login from './components/Login/Login';
import Authenticated from './components/Authenticated/Authenticated';
import './App.css';
import { BackendService } from './backend/backend.service';
import { CSRFMiddleware } from './backend/api/CSRFMiddleware';
import { MaintenanceService } from './backend/api/maintenance.service';
import { UserService } from './backend/api/user.service';
import { AccountsService } from './backend/api/accounts.service';
import { AccountTransformerService } from './backend/controller/account-transformer.service';
import { CredentialService } from './backend/credential.service';
import { CryptoService } from './backend/crypto.service';
import { Account } from './backend/models/account';
import { Configuration as OpenAPIConfiguration } from '@pm-server/pm-server-react-client';
import { MaintenanceApi as OpenAPIMaintenanceService } from '@pm-server/pm-server-react-client';
import { UserApi as OpenAPIUserService } from '@pm-server/pm-server-react-client';
import { AccountsApi as OpenAPIAccountsService } from '@pm-server/pm-server-react-client';

interface AppState {
	ready: boolean,
	message: string,
	authenticated: boolean,
	accounts: Array<Account>
}
export default class App extends React.Component<{}, AppState> {
	backend: BackendService;

	constructor (props: any) {
		super(props);
		this.state = {
			ready: false,
			message: "",
			authenticated: false,
			accounts: []
			
		}
		let csrfMiddleware = new CSRFMiddleware();
		let APIconfiguration = new OpenAPIConfiguration({ basePath: "http://debian-vms-hp.lab:8080", middleware: [csrfMiddleware]});
		let credentialService = new CredentialService();
		let cryptoService = new CryptoService(credentialService);
		let accountTransformerService = new AccountTransformerService(cryptoService); 
		this.backend = new BackendService(
			new MaintenanceService(new OpenAPIMaintenanceService(APIconfiguration), csrfMiddleware), 
			new UserService(new OpenAPIUserService(APIconfiguration), accountTransformerService),
			new AccountsService(new OpenAPIAccountsService(APIconfiguration), accountTransformerService), 
			credentialService, 
			accountTransformerService, 
			cryptoService);
		this.backend.waitForBackend()
			.then(() => {
				this.setState({ready : true});
			});
	        this.backend.loginObservable
                        .subscribe(()=>{
				this.setState({authenticated : true});
			});
	        this.backend.accountsObservable
                        .subscribe((accounts: Array<Account>)=>{
				console.log("(react) received " + accounts.length + " accounts");
				this.setState({accounts : accounts});
			});
	}
	doLogin(username:string, password: string) {
	  this.backend.logon(username, password)
		.catch(() => {
			this.setState({message : "login failed", authenticated : true});
		});
	}

	render() {
	  return (
	    <div className="App">
	      <header className="App-header">
		  Password Manager
		<span>{this.state.message}</span>
	      </header>
	      {this.state.authenticated 
	       ? <Authenticated accounts={this.backend.accounts}/>
	       : <Login doLogin={this.doLogin.bind(this)}/>
	      }
	    </div>
	  );
	}
}

