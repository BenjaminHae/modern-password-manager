import React from 'react';
import Action from './Action';
import { CloudCheck } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import { BasePlugin } from '../BasePlugin';
import { PluginSystem } from '../PluginSystem';
import { Account } from '../../backend/models/account';
import { ICredentialProvider } from '../../backend/controller/credentialProvider';
import { ICredentialSource, CredentialReadiness } from '../../libs/CredentialSource';
import { ILogonInformation } from '../../backend/api/user.service';

declare global {
  interface Window { browserExtensionPlugin: BrowserExtensionPlugin; }
}

class BrowserExtensionPlugin extends BasePlugin implements ICredentialSource {
  private isActive = false;
  private actionsReceived = false;
  private accountsLoaded = false;
  private action?: Action;
  private credentialProvider?: ICredentialProvider;
  private credentialProviderHook: Array<(provider: ICredentialProvider) => void> = [];
  private credentialsPresent?: boolean;
  private credentialsPresentHook: Array<(value: boolean) => void> = [];

  constructor(protected pluginSystem: PluginSystem) {
    super(pluginSystem);
    window.browserExtensionPlugin = this;
  }

  credentialsReady(): Promise<boolean> {
    if (this.isActive === false) {
      return Promise.resolve(false);
    }
    if (this.credentialsPresent !== undefined) {
      return Promise.resolve(this.credentialsPresent);
    }
    return new Promise<boolean>((resolve) => {
      this.credentialsPresentHook.push((value: boolean) => 
        { resolve(value); });
    });
  }
  autoRetryAllowed(): boolean {
    return false;
  }
  
  credentialReadinessSupported(): CredentialReadiness {
    return CredentialReadiness.automated;
  }

  retrieveCredentials(): Promise<ILogonInformation|null> {
    // todo: make sure credentialProvider is here
    if (this.isActive === false) {
      return Promise.resolve(null);
    }
    if (this.credentialsPresent === false) {
      return Promise.resolve(null);
    }
    if (this.credentialProvider) {
      return this.pluginSystem.backendLogin(this.credentialProvider);
    }
    return new Promise<ILogonInformation|null>((resolve, reject) => {
      this.credentialProviderHook.push((provider: ICredentialProvider) => {
          this.pluginSystem.backendLogin(provider)
            .then((info: ILogonInformation) => resolve(info))
            .catch(reject)
        }
      );
    });
  }

  setCredentialsPresent(credentialsPresent: boolean): void {
    this.credentialsPresent = credentialsPresent;
    this.credentialsPresentHook.forEach((hook) => hook(credentialsPresent));
    this.credentialsPresentHook.length = 0;
  }

  private sendEvent(request: string, data?: Record<string, any>): void {
    if (this.isActive === false)
      return
    const evt = new CustomEvent('MPMExtensionEventToContentScript', {detail:{request: request, data: data}});
    document.dispatchEvent(evt);
  }
  loginSuccessful(username: string, key: CryptoKey): void {
    if (this.isActive === false)
      return
    console.log("login Successful");
    this.sendEvent('loginSuccessful', {username: username, key: key});
  }

  loginViewReady(): void {
    if (this.isActive === false)
      return
    console.log("login view ready");
    this.sendEvent('loginViewReady');
  }

  // this callback reacts to accounts in backend being ready
  // it is possibly necessary to react to the "account view" being ready
  accountsReady(): void {
    const firstLoad = !this.accountsLoaded;
    this.accountsLoaded = true;
    if (this.isActive === false)
      return
    if (this.actionsReceived) {
      this.performAction();
    }
    if (firstLoad) {
      this.sendEvent("accountViewReady");
    }
    else {
      this.sendEvent("accountReload");
    }
  }

  preLogout(): void {
    if (this.isActive)
      this.sendEvent("logout");
  }

  performAction(): void {
    if (!this.action)
      return;
    switch (this.action.action) {
      case "logout": 
        this.pluginSystem.logout();
        break;
      case "edit": {
        let account: Account | undefined;
        if ((account = this.pluginSystem.getAccountByIndex(this.action.data.index))) {
          console.log(`found account by id ${account.index}`);
          this.pluginSystem.UIeditAccountSelect(account);
        }
        else {
          console.log("did not find account by id");
          console.log(this.action);
        }
        break;
        }
      case "add":
        this.pluginSystem.UIaddAccountSelect(this.action.data);
        break;
    }
  }

  setAction(action: Action): void {
    this.action = action;
    this.actionsReceived = true;
    if (this.accountsLoaded) {
      this.performAction();
    }
  }

  doLogin(username: string, key: CryptoKey): void {
    const provider = {
        getKey: () => key,
        cleanUp: () => Promise.resolve()
    };
    this.credentialProvider = provider;
    this.credentialProviderHook.forEach((hook) => hook(provider));
    this.credentialProviderHook.length = 0;
  }
  selectAccount(account: Account): void {
    this.sendEvent("selectAccount", {index: account.index});
  }
  passwordButton(account: Account): JSX.Element | void {
    if (this.isActive)
      return (<Button key="BrowserExtensionPlugin" variant="info" onClick={() => this.selectAccount(account)}><CloudCheck/></Button>)
  }

  setActive(): void {
    this.isActive = true;
  }
}
export default BrowserExtensionPlugin;
