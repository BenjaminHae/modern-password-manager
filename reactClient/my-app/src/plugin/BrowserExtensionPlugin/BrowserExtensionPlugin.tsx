import React from 'react';
import Action from './Action';
import { CloudCheck } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import { BasePlugin } from '../BasePlugin';
import { PluginSystem } from '../PluginSystem';
import { Account } from '../../backend/models/account';

declare global {
  interface Window { browserExtensionPlugin: BrowserExtensionPlugin; }
}

class BrowserExtensionPlugin extends BasePlugin {
  private isActive = false;
  private actionsReceived = false;
  private accountsLoaded = false;
  private action?: Action;

  constructor(protected pluginSystem: PluginSystem) {
    super(pluginSystem);
    window.browserExtensionPlugin = this;
  }

  private sendEvent(request: string, data?: Record<string, any>) {
    if (!this.isActive)
      return
    const evt = new CustomEvent('MPMExtensionEventToContentScript', {detail:{request: request, data: data}});
    document.dispatchEvent(evt);
  }
  loginSuccessful(username: string, key: any): void {
    if (!this.isActive)
      return
    console.log("login Successful");
    this.sendEvent('loginSuccessful', {username: username, key: key});
  }

  loginViewReady() {
    if (!this.isActive)
      return
    console.log("login view ready");
    this.sendEvent('loginViewReady');
  }

  // this callback reacts to accounts in backend being ready
  // it is possibly necessary to react to the "account view" being ready
  accountsReady() {
    const firstLoad = !this.accountsLoaded;
    this.accountsLoaded = true;
    if (!this.isActive)
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

  preLogout() {
    if (this.isActive)
      this.sendEvent("logout");
  }

  performAction() {
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

  setAction(action: Action) {
    this.action = action;
    this.actionsReceived = true;
    if (this.accountsLoaded) {
      this.performAction();
    }
  }

  doLogin(username: string, key: CryptoKey) {
    const credentials = {
        getKey: () => key,
        cleanUp: () => Promise.resolve()
    };
    this.pluginSystem.backendLogin(credentials);
  }
  selectAccount(account: Account) {
    this.sendEvent("selectAccount", {index: account.index});
  }
  passwordButton(account: Account): JSX.Element | void {
    if (this.isActive)
      return (<Button key="BrowserExtensionPlugin" variant="info" onClick={() => this.selectAccount(account)}><CloudCheck/></Button>)
  }

  setActive() {
    this.isActive = true;
  }
}
export default BrowserExtensionPlugin;
