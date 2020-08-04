import React from 'react';
import Authenticated from './components/Authenticated/Authenticated';
import Unauthenticated from './components/Unauthenticated/Unauthenticated';
import Message, { IMessageOptions, IMessage } from './components/Message/Message';
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
import { UserOptions } from './backend/models/UserOptions';
import { Configuration as OpenAPIConfiguration } from '@pm-server/pm-server-react-client';
import { MaintenanceApi as OpenAPIMaintenanceService } from '@pm-server/pm-server-react-client';
import { UserApi as OpenAPIUserService } from '@pm-server/pm-server-react-client';
import { AccountsApi as OpenAPIAccountsService } from '@pm-server/pm-server-react-client';
import { PluginSystem, AccountsFilter } from './plugin/PluginSystem';
import { HistoryItem } from '@pm-server/pm-server-react-client';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BoxArrowLeft } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';


interface AppState {
  ready: boolean;
  messages: Array<IMessage>;
  authenticated: boolean;
  registrationAllowed: boolean;
  accounts: Array<Account>;
  userOptions: UserOptions;
  historyItems: Array<HistoryItem>;
  filter?: AccountsFilter;
}
export default class App extends React.Component<{}, AppState> {
  private backend: BackendService;
  private accountTransformerService: AccountTransformerService;
  private crypto: CryptoService;
  private credential: CredentialService;
  private plugins: PluginSystem;

  constructor (props: {}) {
    super(props);
    this.state = {
      ready: false,
      messages: [],
      authenticated: false,
      registrationAllowed: false,
      accounts: [],
      userOptions: {fields:[]},
      historyItems: []
    }

    const csrfMiddleware = new CSRFMiddleware();
    let basePath = "";
    if (process.env.REACT_APP_API_BASE_URL) {
      basePath = process.env.REACT_APP_API_BASE_URL;
    }
    const APIconfiguration = new OpenAPIConfiguration({ basePath: basePath, middleware: [csrfMiddleware]});
    this.credential = new CredentialService();
    this.crypto = new CryptoService(this.credential);
    this.accountTransformerService = new AccountTransformerService(this.crypto); 
    this.backend = new BackendService(
        new MaintenanceService(new OpenAPIMaintenanceService(APIconfiguration), csrfMiddleware), 
        new UserService(new OpenAPIUserService(APIconfiguration), this.accountTransformerService),
        new AccountsService(new OpenAPIAccountsService(APIconfiguration), this.accountTransformerService), 
        this.credential, 
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
      .subscribe((userOptions: UserOptions) => {
          console.log("(react) received options: " + userOptions);
          this.setState({userOptions : userOptions});
          });
  }
  componentDidMount(): void {
    this.backend.waitForBackend()
      .then((backendOptions: BackendOptions) => {
          this.setState({ready : true, registrationAllowed: backendOptions.registrationAllowed});
          });
    this.plugins.setFilterChangeHandler(this.filterChangeHandler.bind(this));
  }
  doLogin(username:string, password: string):Promise<void> {
    return this.backend.logon(username, password)
      .then((info: ILogonInformation) => {
        this.plugins.loginSuccessful(username, this.credential.getKey());
        const options: IMessageOptions = {};
        let message = "";
        if (info.lastLogin) {
          message += `Your last login was on ${info.lastLogin.toLocaleString(navigator.language)}. `;
          options.variant = "info";
        }
        if (info.failedLogins && info.failedLogins > 0) {
          message += `There were ${info.failedLogins} failed logins.`
          options.autoClose = false;
          options.variant = "danger";
        }
        this.showMessage(message, options);
      })
      .catch((e) => {
        this.showMessage("login failed: " + e.toString(), { autoClose: false });
        this.setState({ authenticated: false });
      });
  }
  async doRegister(username: string, password: string, email: string): Promise<void> {
    return this.backend.register(username, password, email);
  }
  async doLogout(): Promise<void> {
    this.plugins.preLogout();
    await this.backend.logout();
    this.setState({authenticated: false});
    window.location.reload(false);
  }
  async doStoreOptions(options: UserOptions): Promise<void> {
    await this.backend.storeUserOptions(options);
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
      for (const item in fields) {
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
    if (!("password" in fields)) {
      throw new Error("Account has no password");
    }
    if (!("name" in fields)) {
      throw new Error("No Account name set");
    }
    // Todo auto-generate password
    const cryptedPassword = await this.crypto.encryptChar(fields["password"]);
    delete fields.password;
    const updatedAccount = new Account(-1, fields.name, cryptedPassword);
    delete fields.name;
    for (const item in fields) {
      updatedAccount.other[item] = fields[item];
    }
    return updatedAccount;
  }
  async bulkAddAccounts(newFields: Array<{[index: string]:string}>): Promise<void> {
    const newAccounts: Array<Account> = [];
    for (const fields of newFields) {
      newAccounts.push(await this.generateNewAccount(fields));
    }
    await this.backend.addAccounts(newAccounts);
  }
  async deleteHandler(account: Account): Promise<void> {
    return this.backend.deleteAccount(account);
  }
  async changePasswordHandler(oldPassword: string, newPassword: string): Promise<void> {
    return await this.backend.changeUserPassword(oldPassword, newPassword);
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
  async getAccountPassword(account: Account): Promise<string> {
    return await this.backend.getPassword(account);
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

  showMessage(text: string, options: IMessageOptions = {}): void {
    const newMessages = this.state.messages;
    const message = {message: text, id: Date.now(), show: true, ...options}
    newMessages.push(message);
    this.setState({messages: newMessages});
    if ( options.autoClose === undefined || options.autoClose) {
      window.setTimeout(() => {
        message.show = false;
      }
      , 5000);
      window.setTimeout(() => {
        const newMessages = this.state.messages.filter((m)=> m.id !== message.id);
        this.setState({messages: newMessages});
      }
      , 7000);
    }
  }

  closeMessage(id: number): void {
    const newMessages = this.state.messages.filter((m)=> m.id !== id);
    this.setState({messages: newMessages});
  }

  render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <Container fluid>
            <Row>
              <Col xl={{ span: 4, offset: 4 }} lg={{ span: 6, offset: 3 }} md={{ span: 6, offset: 3 }} xs={{ span: 6, offset: 1 }} className="text-center">
                Password Manager
              </Col>
              <Col xl={{ span: 2, offset: 2 }} lg={{ span: 2, offset: 1 }} md={{ span: 3, offset: 0 }} xs={{ span: 3, offset: 2 }} className="text-right">
                {this.state.authenticated &&
                  <Button 
                    className={styles.Logout} 
                    onClick={this.doLogout.bind(this)} 
                    variant="secondary" 
                  >
                    <BoxArrowLeft/>Logout
                  </Button>
                }
              </Col>
            </Row>
          </Container>
        </header>
        <Message 
            messages={this.state.messages} 
            closeHandler={this.closeMessage.bind(this)}
        />
        {this.state.authenticated &&
         <Authenticated 
            accounts={this.filterAccounts(this.state.accounts)} 
            historyItems={this.state.historyItems} 
            userOptions={this.state.userOptions}
            pluginSystem={this.plugins} 
            editHandler={this.editHandler.bind(this)} 
            getAccountPasswordHandler={this.getAccountPassword.bind(this)}
            bulkAddHandler={this.bulkAddAccounts.bind(this)} 
            deleteHandler={this.deleteHandler.bind(this)} 
            changePasswordHandler={this.changePasswordHandler.bind(this)} 
            loadHistoryHandler={this.loadHistory.bind(this)} 
            showMessage={this.showMessage.bind(this)} 
            doStoreOptions={this.doStoreOptions.bind(this)}
        />
              }
        {!this.state.authenticated
          && <Unauthenticated 
                doLogin={this.doLogin.bind(this)} 
                doRegister={this.doRegister.bind(this)} 
                showRegistration={this.state.registrationAllowed} 
                showMessage={this.showMessage.bind(this)} 
                ready={this.state.ready}
              /> }
        {!this.state.authenticated && !this.state.ready 
          && <span>Waiting for server</span> }
        <footer className="App-footer">Version: {process.env.REACT_APP_GIT_SHA}</footer>
      </div>
    );
  }
}

