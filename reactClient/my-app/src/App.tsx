import React from 'react';
import Login from './components/Login/Login';
import Authenticated from './components/Authenticated/Authenticated';
import Register from './components/Register/Register';
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
import { FieldOptions } from './backend/models/fieldOptions';
import { Configuration as OpenAPIConfiguration } from '@pm-server/pm-server-react-client';
import { MaintenanceApi as OpenAPIMaintenanceService } from '@pm-server/pm-server-react-client';
import { UserApi as OpenAPIUserService } from '@pm-server/pm-server-react-client';
import { AccountsApi as OpenAPIAccountsService } from '@pm-server/pm-server-react-client';

interface AppState {
	ready: boolean;
	message: string;
	authenticated: boolean;
	accounts: Array<Account>;
	fields: Array<FieldOptions>
}
interface AppProps {
}
export default class App extends React.Component<AppProps, AppState> {
	backend: BackendService;
	accountTransformerService: AccountTransformerService;
        crypto: CryptoService;
	constructor (props: AppProps) {
		super(props);
		this.state = {
			ready: false,
			message: "",
			authenticated: false,
			accounts: [],
                        fields: []
		}
		let csrfMiddleware = new CSRFMiddleware();
		let APIconfiguration = new OpenAPIConfiguration({ basePath: "http://debian-vms-hp.lab:8080", middleware: [csrfMiddleware]});
		let credentialService = new CredentialService();
		this.crypto = new CryptoService(credentialService);
		this.accountTransformerService = new AccountTransformerService(this.crypto); 
		this.backend = new BackendService(
			new MaintenanceService(new OpenAPIMaintenanceService(APIconfiguration), csrfMiddleware), 
			new UserService(new OpenAPIUserService(APIconfiguration), this.accountTransformerService),
			new AccountsService(new OpenAPIAccountsService(APIconfiguration), this.accountTransformerService), 
			credentialService, 
			this.accountTransformerService, 
			this.crypto);
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
	        this.backend.optionsObservable
                        .subscribe((fieldOptions: Array<FieldOptions>) => {
				console.log("(react) received fields: " + fieldOptions);
				this.setState({fields : fieldOptions});
			});
	}
	doLogin(username:string, password: string) {
	  this.backend.logon(username, password)
		.catch(() => {
			this.setState({message : "login failed", authenticated : false});
		});
	}
        async doRegister(username: string, password: string, email: string): Promise<void> {
          return this.backend.register(username, password, email);
        }
        async doLogout(): Promise<void> {
          await this.backend.logout();
          this.setState({authenticated: false});
          window.location.reload(false);
        }
        async editHandler(fields: {[index: string]:string}, account?: Account): Promise<void> {
	    let updatedAccount: Account;
	    if (account) {
	      updatedAccount = account;
	      updatedAccount.name = fields.name;
              delete fields.name;
	      //Only look at password if it has changed
	      if (fields.password !== "") {
		console.log("passwordChanged");
		updatedAccount.enpassword = await this.crypto.encryptChar(fields.password);
	      }
              delete fields.password;
	    }
	    else {
	      // Todo auto-generate password
	      let cryptedPassword = await this.crypto.encryptChar(fields["password"]);
              delete fields.password;
	      updatedAccount = new Account(-1, fields.name, cryptedPassword);
              delete fields.name;
	    }
            for (let item in fields) {
              updatedAccount.other[item] = fields[item];
            }
	    if (!account) {
		    return this.backend.addAccount(updatedAccount);
	    }
	    else {
                    console.log("updating account");
                    console.log(updatedAccount);
		    return this.backend.updateAccount(updatedAccount);
	    }
        }

	render() {
	  return (
	    <div className="App">
	      <header className="App-header">
		  Password Manager
		<span>{this.state.message}</span>
	      </header>
	      {this.state.authenticated 
	       ? <Authenticated accounts={this.state.accounts} fields={this.state.fields} backend={this.backend} transformer={this.accountTransformerService} editHandler={this.editHandler.bind(this)} logoutHandler={this.doLogout.bind(this)}/>
	       : <Login doLogin={this.doLogin.bind(this)}/>
	      }
              <Register doRegister={this.doRegister.bind(this)} />
	    </div>
	  );
	}
}

