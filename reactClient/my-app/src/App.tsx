import React from 'react';
import Authenticated from './components/Authenticated/Authenticated';
import Unauthenticated from './components/Unauthenticated/Unauthenticated';
import Message from './components/Message/Message';
import './App.css';
import styles from './App.module.css';
import { BackendService } from './backend/backend.service';
import { CSRFMiddleware } from './backend/api/CSRFMiddleware';
import { MaintenanceService, BackendOptions } from './backend/api/maintenance.service';
import { UserService, ILogonInformation } from './backend/api/user.service';
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
import { HistoryItem } from '@pm-server/pm-server-react-client';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


interface AppState {
  ready: boolean;
  message: string;
  messageImportant: boolean;
  messageShow: boolean;
  authenticated: boolean;
  registrationAllowed: boolean;
  accounts: Array<Account>;
  fields: Array<FieldOptions>;
  historyItems: Array<HistoryItem>;
  filter?: AccountsFilter;
  messageClickHandler?: (()=>void);
}
interface AppProps {
}
export default class App extends React.Component<AppProps, AppState> {
	backend: BackendService;
  accountTransformerService: AccountTransformerService;
  crypto: CryptoService;
  plugins: PluginSystem;
  messageTimeout: number = 0;

  constructor (props: AppProps) {
    super(props);
    this.state = {
      ready: false,
      message: "",
      messageImportant: false,
      messageShow: false,
      authenticated: false,
      registrationAllowed: false,
      accounts: [],
      fields: [],
      historyItems: []
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
  doLogin(username:string, password: string):Promise<void> {
    return this.backend.logon(username, password)
      .then((info: ILogonInformation) => {
        let important = false;
        let message = "";
        if (info.lastLogin) {
          message += `Your last login was on ${info.lastLogin.toLocaleString(navigator.language)}. `;
        }
        if (info.failedLogins && info.failedLogins > 0) {
          message += `There were ${info.failedLogins}.`
          important = true;
        }
        this.showMessage(message, important);
      })
      .catch((e) => {
          this.showMessage("login failed: " + e.toString(), true);
          this.setState({ authenticated: false });
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
  async loadHistory(): Promise<void> {
    let history = await this.backend.getHistory()
    history = history.sort( (a, b) => {
        if (a > b) {
          return 1;
        }
        else {
          return -1;
        }
      }
    );
    this.setState({ historyItems: history });
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

  showMessage(message: string, important: boolean = false, clickHandler?: () => void) {
    this.setState({message: message, messageImportant: important, messageClickHandler: clickHandler, messageShow: true});
    window.clearTimeout(this.messageTimeout);
    if (! important) {
      this.messageTimeout = window.setTimeout(() => {this.setState({messageShow: false})}, 5000);
    }
  }

  closeMessage() {
    this.setState({messageShow: false});
  }

	render() {
	  return (
	    <div className="App">
	      <header className="App-header">
          Password Manager
          {this.state.authenticated &&
            <Button className={styles.Logout} onClick={this.doLogout.bind(this)} variant="secondary" >Logout</Button>
          }
	      </header>
        <Message 
            message={this.state.message} 
            show={this.state.messageShow}
            important={this.state.messageImportant}
            closeHandler={this.closeMessage.bind(this)}
        />
	      {this.state.authenticated &&
	       <Authenticated 
            accounts={this.filterAccounts(this.state.accounts)} 
            fields={this.state.fields} 
            historyItems={this.state.historyItems} 
            backend={this.backend} 
            pluginSystem={this.plugins} 
            transformer={this.accountTransformerService} 
            editHandler={this.editHandler.bind(this)} 
            bulkAddHandler={this.bulkAddAccounts.bind(this)} 
            deleteHandler={this.deleteHandler.bind(this)} 
            changePasswordHandler={this.changePasswordHandler.bind(this)} 
            loadHistoryHandler={this.loadHistory.bind(this)} 
            showMessage={this.showMessage.bind(this)} 
        />
              }
        {!this.state.authenticated
          && <Unauthenticated 
                doLogin={this.doLogin.bind(this)} 
                doRegister={this.doRegister.bind(this)} 
                showRegistration={this.state.registrationAllowed} 
                ready={this.state.ready}
              /> }
        {!this.state.authenticated && !this.state.ready 
          && <span>Waiting for server</span> }
        <footer className="App-footer">Version: {process.env.REACT_APP_GIT_SHA}</footer>
	    </div>
	  );
	}
}

