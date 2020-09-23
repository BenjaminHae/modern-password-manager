import React from 'react';
import { Account } from '../../backend/models/account';
import { BasePlugin, IPluginWithEditInputButton } from '../BasePlugin';
import Button from 'react-bootstrap/Button';
import { ArrowLeftRight } from 'react-bootstrap-icons';

const DefaultPasswordLength = 20;

export default class PasswordGeneratorPlugin extends BasePlugin implements IPluginWithEditInputButton {

  generatePassphrase(plength = DefaultPasswordLength, alphabet = String.fromCharCode(...Array(123).keys()).slice(32).replace(/`/g, '')): string {
    let maxPos = alphabet.length;
    let array = new Uint8Array(plength);
    window.crypto.getRandomValues(array);
    //return String.fromCharCode.apply(null,array.map((item) => { return alphabet.charAt(item % maxPos).charCodeAt(0);} ));
    return new TextDecoder().decode(array.map((item) => { return alphabet.charAt(item % maxPos).charCodeAt(0);} ));
  }

  fillInputWithPassword(setValue: (val: string) => void): void {
    setValue(this.generatePassphrase());
  }

  editPreShow(fields: {[index: string]:string}, account?: Account): void {
    if (!account && fields["password"] === "") {
      fields["password"] = this.generatePassphrase();
    }
  }

  editInputButton(inputKey: string, currentValue: string, setValue: (val: string) => void, account?: Account): JSX.Element | void {
    if (inputKey !== "password")
      return
    return (<Button key="PasswordGeneratorPlugin" onClick={() => this.fillInputWithPassword(setValue)}><ArrowLeftRight/></Button>)
  }

}
