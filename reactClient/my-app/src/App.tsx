import React from 'react';
import Authenticated from './components/Authenticated/Authenticated';
import Unauthenticated from './components/Unauthenticated/Unauthenticated';
import './App.css';
import { BackendService } from './backend/backend.service';
import { CSRFMiddleware } from './backend/api/CSRFMiddleware';
import { MaintenanceService, BackendOptions } from './backend/api/maintenance.service';
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
import { PluginSystem, AccountsFilter } from './plugin/PluginSystem';

interface AppState {
  ready: boolean,
  message: string,
  authenticated: boolean,
  registrationAllowed: boolean,
  accounts: Array<Account>,
  fields: Array<FieldOptions>,
  filter?: AccountsFilter,
}
interface AppProps {
}
export default class App extends React.Component<AppProps, AppState> {
	backend: BackendService;
  accountTransformerService: AccountTransformerService;
  crypto: CryptoService;
  plugins: PluginSystem;

	constructor (props: AppProps) {
		super(props);
		this.state = {
			ready: false,
			message: "",
			authenticated: false,
			registrationAllowed: false,
			accounts: [],
      fields: []
    }

    let csrfMiddleware = new CSRFMiddleware();
    let basePath = "";
    if (process.env.REACT_APP_API_BASE_URL) {
      basePath = process.env.REACT_APP_API_BASE_URL;
    }
		let APIconfiguration = new OpenAPIConfiguration({ basePath: basePath, middleware: [csrfMiddleware]});
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
    this.plugins = new PluginSystem(this.backend, this.accountTransformerService);
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
  componentDidMount() {
    this.backend.waitForBackend()
      .then((backendOptions: BackendOptions) => {
          this.setState({ready : true, registrationAllowed: backendOptions.registrationAllowed});
          });
    this.plugins.setFilterChangeHandler(this.filterChangeHandler.bind(this));
  }
  doLogin(username:string, password: string) {
    this.backend.logon(username, password)
      .catch((e) => {
          console.log(e);
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
      for (let item in fields) {
        updatedAccount.other[item] = fields[item];
      }
    }
    else {
      updatedAccount = await this.generateNewAccount(fields);
    }
    if (!account) {
      return this.backend.addAccount(updatedAccount);
    }
    else {
      return this.backend.updateAccount(updatedAccount);
    }
  }
  async generateNewAccount(fields: {[index: string]:string}): Promise<Account> {
    let updatedAccount: Account;
    if (!("password" in fields)) {
      throw new Error("Account has no password");
    }
    if (!("name" in fields)) {
      throw new Error("No Account name set");
    }
    // Todo auto-generate password
    let cryptedPassword = await this.crypto.encryptChar(fields["password"]);
    delete fields.password;
    updatedAccount = new Account(-1, fields.name, cryptedPassword);
    delete fields.name;
    for (let item in fields) {
      updatedAccount.other[item] = fields[item];
    }
    return updatedAccount;
  }
  async bulkAddAccounts(newFields: Array<{[index: string]:string}>): Promise<void> {
    let newAccounts: Array<Account> = [];
    for (let fields of newFields) {
      newAccounts.push(await this.generateNewAccount(fields));
    }
    await this.backend.addAccounts(newAccounts);
  }
  async deleteHandler(account: Account): Promise<void> {
    return this.backend.deleteAccount(account);
  }
  async changePasswordHandler(oldPassword: string, newPassword: string): Promise<void> {
    if (await this.backend.verifyPassword(oldPassword) !== true) {
      throw new Error("old Password does not match current password");
    }
    return await this.backend.changeUserPassword(newPassword);
  }

  filterChangeHandler(filter: AccountsFilter): void {
    this.setState( {filter: filter} );
  }

  filterAccounts(accounts: Array<Account>): Array<Account> {
    if (this.state.filter) {
      return this.state.filter(accounts);
    }
    return accounts;
  }

	render() {
	  return (
	    <div className="App">
	      <header className="App-header">
          Password Manager
          <span>{this.state.message}</span>
	      </header>
	      {this.state.authenticated &&
	       <Authenticated accounts={this.filterAccounts(this.state.accounts)} fields={this.state.fields} backend={this.backend} transformer={this.accountTransformerService} editHandler={this.editHandler.bind(this)} bulkAddHandler={this.bulkAddAccounts.bind(this)} deleteHandler={this.deleteHandler.bind(this)} logoutHandler={this.doLogout.bind(this)} changePasswordHandler={this.changePasswordHandler.bind(this)} pluginSystem={this.plugins}/>
              }
        {!this.state.authenticated && this.state.ready
          && <Unauthenticated doLogin={this.doLogin.bind(this)} doRegister={this.doRegister.bind(this)} showRegistration={this.state.registrationAllowed} /> }
        {!this.state.authenticated && !this.state.ready 
          && <span>Waiting for server</span> }
        <footer>Version: {process.env.REACT_APP_GIT_SHA}</footer>
	    </div>
	  );
	}
}

