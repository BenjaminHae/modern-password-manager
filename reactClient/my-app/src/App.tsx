import React from 'react';
import DebugViewer from './components/DebugViewer/DebugViewer';
import Authenticated from './components/Authenticated/Authenticated';
import Unauthenticated from './components/Unauthenticated/Unauthenticated';
import ShortcutOverview from './components/ShortcutOverview/ShortcutOverview';
import Message, { IMessageOptions, IMessage } from './components/Message/Message';
import './App.css';
import styles from './App.module.css';
import { BackendService } from './backend/backend.service';
import { CSRFMiddleware } from './backend/api/CSRFMiddleware';
import { MaintenanceService, BackendOptions } from './backend/api/maintenance.service';
import { UserService, ILogonInformation } from './backend/api/user.service';
import { AccountsService } from './backend/api/accounts.service';
import { AccountTransformerService } from './backend/controller/account-transformer.service';
import CredentialProviderPersist from './backend/controller/credentialProviderPersist';
import { CredentialService } from './backend/credential.service';
import { CryptoService } from './backend/crypto.service';
import { Account } from './backend/models/account';
import { UserOptions } from './backend/models/UserOptions';
import { Configuration as OpenAPIConfiguration } from '@pm-server/pm-server-react-client';
import { MaintenanceApi as OpenAPIMaintenanceService } from '@pm-server/pm-server-react-client';
import { UserApi as OpenAPIUserService } from '@pm-server/pm-server-react-client';
import { AccountsApi as OpenAPIAccountsService } from '@pm-server/pm-server-react-client';
import { PluginSystem, AccountsFilter } from './plugin/PluginSystem';
import WebAuthn from './libs/WebAuthn';
import ShortcutManager from './libs/ShortcutManager';
import PersistDecryptionKey from './libs/PersistDecryptionKey';
import { HistoryItem, UserWebAuthnCred } from '@pm-server/pm-server-react-client';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BoxArrowLeft } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

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
}

export default class App extends React.Component<Record<string, never>, AppState> {
  private backend: BackendService;
  private accountTransformerService: AccountTransformerService;
  private crypto: CryptoService;
  private credential: CredentialService;
  private plugins: PluginSystem;
  private shortcuts: ShortcutManager;
  private readonly idleTimeout = 3 * 60 * 1000;

  constructor (props: Record<string, never>) {
    super(props);
    this.state = {
      ready: false,
      autoLogin: new URLSearchParams(window.location.search).get('noAutoLogin') === null,
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
      showShortcutOverview: false

    }

    window.addEventListener('error', (event) => {this.debug(event.message);});

    let basePath = "";
    if (process.env.REACT_APP_API_BASE_URL) {
      basePath = process.env.REACT_APP_API_BASE_URL;
    }
    const csrfMiddleware = new CSRFMiddleware();
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
    this.plugins = new PluginSystem(this.backend, this.accountTransformerService, this.shortcuts);
    this.plugins.registerAppHandler(this);
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
  debug(line: string): void {
    this.state.debug.unshift(line);
    this.setState({debug: this.state.debug});
  }
  componentDidMount(): void {
    this.backend.waitForBackend()
      .then((backendOptions: BackendOptions) => {
          this.setState({ready : true, registrationAllowed: backendOptions.registrationAllowed});
          if (this.state.autoLogin) {
            this.webAuthnTryLogin();
          }
          this.plugins.loginViewReady();
          });
    this.plugins.setFilterChangeHandler(this.filterChangeHandler.bind(this));
    window.history.pushState({}, "", "/");
    const showShortcuts = () => { 
      this.setState({showShortcutOverview: !this.state.showShortcutOverview});
      return false;
    }
    this.shortcuts.addShortcut({ shortcut: "?", action: showShortcuts, description: "Show Shortcuts", component: this} );
  }
  doLogin(username:string, password: string):Promise<void> {
    this.clearMessages();
    if (!this.state.ready) {
      this.showMessage("backend is not ready yet. Please try again in a second.");
      return Promise.resolve();
    }
    return this.backend.logon(username, password)
      .then((info: ILogonInformation) => {
        this.handleLoginSuccess(info, username);
      })
      .catch((e) => {
        let msg = e.toString();
        if ("status" in e) {
          if (e.status === 500) {
            msg = "please reload page";
          }
          if (e.status === 401) {
            msg = "invalid credentials";
          }
        }
        this.showMessage("Login failed, " + msg, { autoClose: false });
        this.setState({ authenticated: false });
      });
  }

  handleLoginSuccess(info: ILogonInformation, username:string) {
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
  } 

  async doRegister(username: string, password: string, email: string): Promise<void> {
    this.clearMessages();
    return this.backend.register(username, password, email);
  }
  async doLogout(): Promise<void> {
    this.plugins.preLogout();
    await this.backend.logout();
    this.setState({authenticated: false});
    window.location.replace(window.location.origin + window.location.pathname + '?noAutoLogin');
  }
  onIdle(): void {
    this.doLogout();
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
    const creds = await this.backend.getWebAuthnCreds()
    this.setState({ webAuthnCreds: creds });
  }

  async webAuthnCreate(deviceName: string, userName: string, password: string): Promise<void> {
    const persistor = new PersistDecryptionKey()
    const creds = new CredentialProviderPersist(persistor);
    this.debug('starting registration of WebAuthN keys');
    await creds.generateFromPassword(password);
    if (!await this.backend.verifyCredentials(creds)) {
      this.debug('Password did not match');
      return Promise.reject("Password does not match");
    }
    this.debug('persist decryption key locally');
    const storedKey = await creds.persistKey();
    try {
      this.debug('Retrieving challenge');
      const challenge = await this.backend.getWebAuthnChallenge();
      this.debug('Received Challenge');
      const webAuthn = new WebAuthn();
      const userIdBuffer = new ArrayBuffer(16);
      const idView = new DataView(userIdBuffer);
      idView.setInt16(1, storedKey.keyIndex);
      this.debug('Requesting credential from device');
      const webAuthCredential = await webAuthn.createCredential(challenge, 'Password-Manager', {id: userIdBuffer, displayName:userName, name:userName});
      this.debug(`Device handled registration successfully`);
      persistor.appendCredentialId(storedKey.keyIndex, webAuthCredential.rawId, webAuthCredential.id, userName);
      const attestationResponse = webAuthCredential.response as AuthenticatorAttestationResponse;
      this.debug(`Sending registration to backend`);
      await this.backend.createWebAuthn(webAuthCredential.id, deviceName, attestationResponse.attestationObject, attestationResponse.clientDataJSON, webAuthCredential.type, storedKey.wrappedServerKey);
      this.debug(`Success`);
    } catch(e) {
      this.debug(`Registration failed: ${e.message}`);
      this.debug(`Removing persisted keys`);
      persistor.removeKeys(storedKey.keyIndex);
      throw e;
    }
  }
  async webAuthnDelete(webAuthnCreds: UserWebAuthnCred): Promise<void> {
    const creds = await this.backend.deleteWebAuthn(webAuthnCreds.id);
    this.setState({ webAuthnCreds: creds });
  }

  async webAuthnTryLogin(): Promise<void> {
    this.debug("trying webauthn login");
    const webAuthn = new WebAuthn();
    const persistor = new PersistDecryptionKey();
    const credIds = await persistor.getCredentialIds();
    const credsAvailable = credIds.length > 0;
    this.debug(`Are credsAvailable: ${credsAvailable}`);
    this.debug(`KeyIds: ${credIds}`);
    this.setState({webAuthnPresent: credsAvailable});
    if (credsAvailable) {
      this.debug(`Trying to do webAuthn get`);
      let credentials: PublicKeyCredential;
      try {
        credentials = await webAuthn.getCredential(await this.backend.getWebAuthnChallenge(), credIds);
      }
      catch(e) {
        this.debug(`WebAuthn get failed: ${e.message}`);
        throw e;
      }
      const response = credentials.response as AuthenticatorAssertionResponse;
      let keyIndex: number | undefined;
      if (!response.userHandle) {
        this.debug(`no user Handle was specified`);
        this.debug(`Trying to get by id ${credentials.id}`);
        try {
          keyIndex = await persistor.indexByCredentialId(credentials.id);
        }
        catch(e) {
          this.debug(`Finding credential in indexdb failed: ${e.message}`);
          throw e;
        }
        if (!keyIndex) {
          this.debug(`could not get key by id`);
          throw new Error("no user Handle or keyId was specified");
        }
      }
      else {
        const userIdView = new DataView(response.userHandle);
        keyIndex = userIdView.getInt16(1)
      }
      try {
        this.debug(`sending webauthn to server`);
        const info = await this.backend.logonWithWebAuthn(credentials.id, response.authenticatorData, response.clientDataJSON, response.signature, credentials.type, keyIndex, persistor);
        this.debug(`successful`);
        this.handleLoginSuccess(info, "");
      }
      catch(e) {
        this.debug(`WebAuthn Login failed: ${e.message}`);
        this.showMessage(`WebAuthn Login failed: ${e.message}`, {autoClose: false, variant: "danger" });
        throw e;
      }
    }
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

  clearMessages(): void {
    this.setState({messages: []});
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
                    <BoxArrowLeft/> Logout
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
            shortcuts={this.shortcuts}

            editAccountHandler={this.editHandler.bind(this)} 
            getAccountPasswordHandler={this.getAccountPassword.bind(this)}
            bulkAddHandler={this.bulkAddAccounts.bind(this)} 
            deleteAccountHandler={this.deleteHandler.bind(this)} 
            changePasswordHandler={this.changePasswordHandler.bind(this)} 
            loadHistoryHandler={this.loadHistory.bind(this)} 
            showMessage={this.showMessage.bind(this)} 
            doStoreOptions={this.doStoreOptions.bind(this)}

            idleTimeout={ this.idleTimeout }
            onIdle={ this.onIdle.bind(this) }

            //webAuthn
            webAuthnDevices={this.state.webAuthnCreds}
            webAuthnThisDeviceRegistered={false}
            webAuthnLoadHandler={this.loadWebAuthnCreds.bind(this)}
            webAuthnCreateCredHandler={this.webAuthnCreate.bind(this)}
            webAuthnDeleteCredHandler={this.webAuthnDelete.bind(this)}
        />
              }
        {!this.state.authenticated
          && <Unauthenticated 
                doLogin={this.doLogin.bind(this)} 
                doRegister={this.doRegister.bind(this)} 
                showRegistration={this.state.registrationAllowed} 
                showMessage={this.showMessage.bind(this)} 
                showPersistedLogons={this.state.webAuthnPresent}
                ready={this.state.ready}
              /> }
        {!this.state.authenticated && !this.state.ready 
          && <span>Waiting for server</span> }
        {this.state.debugCount >= 1 &&
          <DebugViewer messages={this.state.debug} counter={this.state.debugCount*10} /> }
          <ShortcutOverview shortcuts={this.shortcuts} show={this.state.showShortcutOverview} hide={() => this.setState({showShortcutOverview: false})}/>
        <footer className="App-footer"><span onClick={()=>{this.setState({ debugCount: this.state.debugCount + 1 })}}>Version: {process.env.REACT_APP_GIT_SHA}</span></footer>
      </div>
    );
  }
}

