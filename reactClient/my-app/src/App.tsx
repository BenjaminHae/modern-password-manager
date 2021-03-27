import React from 'react';
import DebugViewer from './components/DebugViewer/DebugViewer';
import Authenticated from './components/Authenticated/Authenticated.lazy';
import Unauthenticated from './components/Unauthenticated/Unauthenticated';
import ShortcutOverview from './components/ShortcutOverview/ShortcutOverview';
import Message from './components/Message/Message';
import './App.scss';
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
import ShortcutManager from './libs/ShortcutManager';
import MessageManager, { IMessageOptions, IMessage } from './libs/MessageManager';
import { HistoryItem, UserWebAuthnCred } from '@pm-server/pm-server-react-client';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { BoxArrowLeft } from 'react-bootstrap-icons';
import CredentialSourceManager, { ICredentialSource } from './libs/CredentialSource';
import WebAuthNCredentialSource from './libs/WebAuthnCredentialSource';
import PasswordCredentialSource from './libs/PasswordCredentialSource';
import { AuthenticatedView } from './components/commonProps';

interface AppState {
  ready: boolean;
  autoLogin: boolean;
  messages: Array<IMessage>;
  authenticated: boolean;
  registrationAllowed: boolean;
  accounts: Array<Account>;
  userOptions: UserOptions;
  historyItems: Array<HistoryItem>;
  filter?: AccountsFilter;
  webAuthnCreds: Array<UserWebAuthnCred>;
  webAuthnPresent: boolean;
  debug: Array<string>;
  debugCount: number;
  showShortcutOverview: boolean;
  idleTimeout: number;
  doingAutoLogin: boolean;
  view: AuthenticatedView;
}

export default class App extends React.Component<Record<string, never>, AppState> {
  private backend: BackendService;
  private accountTransformerService: AccountTransformerService;
  private crypto: CryptoService;
  private credential: CredentialService;
  private plugins: PluginSystem;
  private shortcuts: ShortcutManager;
  private messages: MessageManager;
  private backendWaiter: Promise<BackendOptions>; // promise for the first call to the backend
  private csrfMiddleware: CSRFMiddleware;
  private credentialSourceManager: CredentialSourceManager;
  private webAuthnCredentialSource: WebAuthNCredentialSource;
  private passwordCredentialSource: PasswordCredentialSource;

  constructor (props: Record<string, never>) {
    super(props);
    const URLParams = new URLSearchParams(window.location.search);
    this.state = {
      ready: false,
      autoLogin: URLParams.get('noAutoLogin') === null,
      messages: [],
      authenticated: false,
      registrationAllowed: false,
      accounts: [],
      userOptions: {fields:[]},
      historyItems: [],
      webAuthnCreds: [],
      webAuthnPresent: false,
      debug: [],
      debugCount: -5,
      showShortcutOverview: false,
      idleTimeout: 3 * 60 * 1000,
      doingAutoLogin: false,
      view: AuthenticatedView.List
    }

    window.addEventListener('error', (event) => {this.debug(event.message);});
    window.onerror = (error, url, line) => {
      this.debug(`line ${line}: ${error}`);
    };

    let basePath = "";
    if (process.env.REACT_APP_API_BASE_URL) {
      basePath = process.env.REACT_APP_API_BASE_URL;
    }
    const csrfMiddleware = new CSRFMiddleware();
    this.csrfMiddleware = csrfMiddleware;
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
    this.shortcuts = new ShortcutManager();
    this.messages = new MessageManager((m: Array<IMessage>)=> { this.setState({messages: m}) });
    this.plugins = new PluginSystem(this.backend, this.accountTransformerService, this.shortcuts);
    this.plugins.registerAppHandler(this);
    this.backend.loginObservable
      .subscribe((credential: CredentialService)=>{
          this.handleLoginSuccess("", credential);
          });
    this.backend.logonInformationObservable
      .subscribe((info: ILogonInformation)=>{
          this.messages.clearMessages();
          this.showLogonInformation(info);
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
    this.backendWaiter = this.backend.waitForBackend();

    this.credentialSourceManager = 
      new CredentialSourceManager(
        (value: boolean) => this.setState({doingAutoLogin: value}),
        (msg: string) => this.debug("CredentialSourceManager: " + msg),
        (msg: string) => this.messages.showMessage(msg, {autoClose: false, variant: "danger" })
      );
    this.webAuthnCredentialSource = new WebAuthNCredentialSource(this.backend, this.backendWaiter, (value:string) => this.debug("WebAuthN: " + value));
    this.passwordCredentialSource = new PasswordCredentialSource(this.backend, (value:string) => this.debug("PasswordCredential: " + value));
    this.credentialSourceManager.registerCredentialSource(this.webAuthnCredentialSource);
    this.credentialSourceManager.registerCredentialSource(this.passwordCredentialSource);
    this.plugins.getCredentialSources().forEach((cred: ICredentialSource) => {
      this.credentialSourceManager.registerCredentialSource(cred)
    });

    const message = URLParams.get("message")
    if (message) {
      this.messages.showMessage(message, { autoClose: false, variant: 'info' });
    }
  }
  debug(line: string): void {
    this.state.debug.unshift(line);
    this.setState({debug: this.state.debug});
  }
  componentDidMount(): void {
    this.backendWaiter
      .then((backendOptions: BackendOptions) => {
          this.setState({ready : true, registrationAllowed: backendOptions.registrationAllowed, idleTimeout: backendOptions.idleTimeout});
          this.credentialSourceManager.getCredentials(this.state.autoLogin);
          this.plugins.loginViewReady();
        });
    this.getWebAuthnCredsAvailable();
    this.plugins.setFilterChangeHandler(this.filterChangeHandler.bind(this));
    window.history.pushState({}, "", "/");
    const showShortcuts = () => { 
      this.setState({showShortcutOverview: !this.state.showShortcutOverview});
      return false;
    }
    this.shortcuts.addShortcut({ shortcut: "?", action: showShortcuts, description: "Show Shortcuts", component: this} );
    this.shortcuts.addShortcut({ shortcut: "q", action: () => { this.doLogout() }, description: "Logout", component: this} );
  }
  async doLogin(username:string, password: string): Promise<void> {
    await this.passwordCredentialSource.provideUsernameAndPassword(username, password);
  }

  handleLoginSuccess(username: string, credential: CredentialService): void {
    this.setState({authenticated : true});
    this.plugins.loginSuccessful(username, credential.getKey());
  } 

  showLogonInformation(info: ILogonInformation): void {
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
      options.button = { variant: "info",  text: "More Information", handler: () => { this.selectView(AuthenticatedView.History) } };
    }
    this.showMessage(message, options);
  }

  selectView(view: AuthenticatedView) {
    this.setState({ view: view });
  }

  async doRegister(username: string, password: string, email: string): Promise<void> {
    this.messages.clearMessages();
    return this.backend.register(username, password, email);
  }
  async doLogout(message?: string): Promise<void> {
    this.plugins.preLogout();
    await this.backend.logout();
    this.setState({authenticated: false});
    let parameters = '?noAutoLogin'
    parameters += message ? `&message=${encodeURIComponent(message)}` : "";
    window.location.replace(window.location.origin + window.location.pathname + parameters);
  }
  onIdle(): void {
    this.doLogout("You were logged out because you have been inactive.");
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
    if (!fields["password"]) {
      throw new Error("Account with undefined password");
    }
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
  async verifyPassword(password: string): Promise<boolean> {
    return await this.backend.verifyPassword(password);
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
  async loadWebAuthnCreds(): Promise<void> {
    const creds = await this.webAuthnCredentialSource.getUserBackendCredential()
    this.setState({ webAuthnCreds: creds });
  }

  async webAuthnDelete(webAuthnCreds: UserWebAuthnCred): Promise<void> {
    const creds = await this.webAuthnCredentialSource.deleteCredential(webAuthnCreds.id);
    this.setState({ webAuthnCreds: creds });
  }

  async getWebAuthnCredsAvailable(): Promise<void> {
    const credsAvailable =  await this.webAuthnCredentialSource.credentialsReady();
    this.setState({webAuthnPresent: credsAvailable});
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
    this.messages.showMessage(text, options);
  }

  render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <Container fluid>
            <Row>
              <Col xl={{ span: 4, offset: 4 }} lg={{ span: 6, offset: 3 }} md={{ span: 6, offset: 3 }} xs={{ span: 6, offset: 0 }} className="text-center">
                Password Manager
              </Col>
              <Col xl={{ span: 2, offset: 2 }} lg={{ span: 2, offset: 1 }} md={{ span: 3, offset: 0 }} xs={{ span: 6, offset: 0 }} className="text-right logoutButtonCell">
                {this.state.authenticated &&
                  <Button 
                    className={styles.Logout} 
                    onClick={() => {this.doLogout()}} 
                    variant="secondary" 
                  >
                    <BoxArrowLeft/> Logout
                  </Button>
                }
              </Col>
            </Row>
          </Container>
        </header>
        <Message 
            messages={this.state.messages} 
            closeHandler={(message: IMessage) => this.messages.hideMessage(message)}
        />
        {this.state.authenticated &&
         <Authenticated 
            view = { this.state.view }
            changeView = { (view) => this.selectView(view) }
            accounts = { this.filterAccounts(this.state.accounts) } 
            historyItems = { this.state.historyItems } 
            userOptions = { this.state.userOptions }

            pluginSystem = { this.plugins } 
            shortcuts = { this.shortcuts }

            editAccountHandler = { this.editHandler.bind(this) } 
            getAccountPasswordHandler = { this.getAccountPassword.bind(this) }
            bulkAddHandler = { this.bulkAddAccounts.bind(this) } 
            deleteAccountHandler = { this.deleteHandler.bind(this) } 
            changePasswordHandler = { this.changePasswordHandler.bind(this) } 
            loadHistoryHandler = { this.loadHistory.bind(this) } 
            showMessage = { this.showMessage.bind(this) } 
            doStoreOptions = { this.doStoreOptions.bind(this) }

            verifyPassword = { this.verifyPassword.bind(this) }

            idleTimeout = { this.state.idleTimeout }
            onIdle = { this.onIdle.bind(this) }

            //webAuthn
            webAuthnDevices = { this.state.webAuthnCreds }
            webAuthnThisDeviceRegistered = { this.state.webAuthnPresent }
            webAuthnLoadHandler = { this.loadWebAuthnCreds.bind(this) }
            webAuthnCreateCredHandler = { (deviceName, userName, password) => this.webAuthnCredentialSource.createCredential(deviceName, userName, password) }
            webAuthnDeleteCredHandler = { this.webAuthnDelete.bind(this) }
        />
              }
        {!this.state.authenticated
          && <Unauthenticated 
                doLogin={this.doLogin.bind(this)} 
                doRegister={this.doRegister.bind(this)} 
                showRegistration={this.state.registrationAllowed} 
                showMessage={this.showMessage.bind(this)} 
                showPersistedLogons={this.state.webAuthnPresent}
                autoLogin={() => this.credentialSourceManager.doLoginWithSource(this.webAuthnCredentialSource).then (() => {return }) }
                ready={this.state.ready}
                doingAutoLogin={this.state.doingAutoLogin}
              /> }
        {!this.state.authenticated && !this.state.ready 
          && <div className={ styles.Waiting }><Spinner animation="border" role="status"/><p>Waiting for server</p></div> }
        {this.state.debugCount >= 1 &&
          <DebugViewer messages={this.state.debug} counter={this.state.debugCount*10} /> }
          <ShortcutOverview shortcuts={this.shortcuts} show={this.state.showShortcutOverview} hide={() => this.setState({showShortcutOverview: false})}/>
        <footer className="App-footer"><span onClick={()=>{this.setState({ debugCount: this.state.debugCount + 1 })}}>Version: {process.env.REACT_APP_GIT_SHA}</span></footer>
      </div>
    );
  }
}

