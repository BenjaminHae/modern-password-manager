import React from 'react';
import { Account } from '../../backend/models/account';
import { BasePlugin, IPluginWithEditInputButton, IPluginWithEditPreShow } from '../BasePlugin';
import Button from 'react-bootstrap/Button';
import { ArrowLeftRight } from 'react-bootstrap-icons';

const DefaultPasswordLength = 20;

export default class PasswordGeneratorPlugin extends BasePlugin implements IPluginWithEditInputButton, IPluginWithEditPreShow {

  generatePassphrase(plength = DefaultPasswordLength, alphabet = String.fromCharCode(...Array(123).keys()).slice(33).replace(/`/g, '')): string {
    const maxPos = alphabet.length;
    const array = new Uint8Array(plength);
    window.crypto.getRandomValues(array);
    //return String.fromCharCode.apply(null,array.map((item) => { return alphabet.charAt(item % maxPos).charCodeAt(0);} ));
    return array.reduce((password, x) => password += alphabet.charAt(x % maxPos), "");
  }

  fillInputWithPassword(setValue: (val: string) => void): void {
    setValue(this.generatePassphrase());
  }

  editPreShow(fields: {[index: string]:string}, account?: Account): void {
    if (!account && fields["password"] === "") {
      fields["password"] = this.generatePassphrase();
    }
  }

  editInputButton(inputKey: string, currentValue: string, setValue: (val: string) => void): JSX.Element | void {
    if (inputKey !== "password")
      return
    return (<Button key="PasswordGeneratorPlugin" onClick={() => this.fillInputWithPassword(setValue)}><ArrowLeftRight/></Button>)
  }

}
