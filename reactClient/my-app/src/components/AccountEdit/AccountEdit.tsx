import React from 'react';
import styles from './AccountEdit.module.css';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import { PluginSystem } from '../../plugin/PluginSystem';
import { IMessageOptions } from '../Message/Message';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { Eye, X, Check2, Trash } from 'react-bootstrap-icons';

interface AccountEditProps {
  account?: Account;
  proposals?: {[index: string]:string};
  fields: Array<FieldOptions>;
  editHandler: (fields: {[index: string]:string}, account?: Account) => Promise<void>;
  deleteHandler: (account: Account) => Promise<void>;
  closeHandler: () => void;
  getAccountPasswordHandler: (account: Account) => Promise<string>;
  showMessage: (message: string, options: IMessageOptions) => void;
  pluginSystem: PluginSystem;
}
interface AccountEditState {
  fields: {[index: string]:string};
  waiting: boolean;
}
class AccountEdit extends React.Component<AccountEditProps, AccountEditState> {

  constructor(props: AccountEditProps) {
    super(props);
    this.state = { fields: this.generateFieldContents(), waiting: false};
  }

  componentDidUpdate(prevProps: AccountEditProps): void {
    if (this.props.account !== prevProps.account) {
      this.setState({fields: this.generateFieldContents()});
    }
  }

  generateFieldContents(): {[index: string]:string} {
    const newFields: {[index: string]:string} = { name: "", password: "" };
    for (const item of this.props.fields) {
      newFields[item.selector] = "";
    }
    if (this.props.account) {
      newFields["name"] = this.props.account.name;
      for (const otherKey in this.props.account.other) {
        newFields[otherKey] = this.props.account.other[otherKey];
      }
    }
    else if (this.props.proposals) {
      for (const key in this.props.proposals) {
        newFields[key] = this.props.proposals[key];
      }
    }
    this.props.pluginSystem.editPreShow(newFields, this.props.account);
    return newFields;
  }
  handleGenericChangeByChangeEvent(event: React.ChangeEvent<HTMLInputElement>): void {
    this.handleGenericChange(event.target.name, event.target.value);
  }
  handleGenericChange(key: string, value: string): void {
    const currentFields = this.state.fields;
    currentFields[key] = value;
    this.setState({fields: currentFields});
  }
  cleanUp(): void {
    const newFields: {[index: string]:string} = { name: "", password: "" };
    for (const item of this.props.fields) {
      newFields[item.selector] = "";
    }
    this.setState({fields: newFields});
  }
  async showPassword(): Promise<void> {
    if (this.props.account) {
      const currentFields = this.state.fields;
      currentFields["password"] = await this.props.getAccountPasswordHandler(this.props.account);
      this.setState({fields: currentFields});
    }
  }
  getButtons(inputKey: string, currentValue: string, account?: Account): Array<JSX.Element | void> {
    return this.props.pluginSystem.editInputButtons(inputKey, currentValue, (val:string) => {
        this.handleGenericChange(inputKey, val);
      }, account);
  }
  renderFormFields(): Array<JSX.Element> {
    const fields = [ (
        <Form.Group controlId="formUsername" key="account">
          <Form.Label>Account Name</Form.Label>
          <InputGroup>
            <Form.Control type="text" autoFocus placeholder="Account name" name="name" onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.handleGenericChangeByChangeEvent(event)} value={this.state.fields["name"]} />
            <InputGroup.Append>
              {this.getButtons("name", this.state.fields["name"], this.props.account)}
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
     ), 
           (
        <Form.Group controlId="formPassword" key="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control type="text" placeholder="Password" name="password" onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.handleGenericChangeByChangeEvent(event)} value={this.state.fields["password"]} />
            <InputGroup.Append>
              {this.getButtons("password", this.state.fields["password"], this.props.account)}
              {this.props.account && 
                <Button variant="info" onClick={this.showPassword.bind(this)}><Eye/></Button>
              }
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
     )];
    const sortFunc = (a: FieldOptions, b: FieldOptions) => {
      if (!a.colNumber) {
        if (!b.colNumber) {
          return 0;
        }
        return 1;
      }
      if (!b.colNumber) {
        return -1;
      }
      return a.colNumber - b.colNumber
    }
    for (const field of this.props.fields.sort(sortFunc)) {
      const fieldOut = (
        <Form.Group controlId={"form" + field.selector} key={field.selector} >
          <Form.Label>{field.name}</Form.Label>
          <InputGroup>
            <Form.Control type="text" placeholder={field.name} name={field.selector} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.handleGenericChangeByChangeEvent(event)} value={this.state.fields[field.selector]} /> 
            <InputGroup.Append>
              {this.getButtons(field.selector, this.state.fields[field.selector], this.props.account)}
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
        );
      if (field.colNumber) {
        fields.splice(field.colNumber, 0, fieldOut);
      }
      else {
        fields.push(fieldOut);
      }
    }
    return fields;
  }
  submitForm(event: React.FormEvent): void {
    event.preventDefault();
    this.submitData();
  }
  async submitData(): Promise<void> {
    try {
      this.setState({waiting: true});
      await this.props.editHandler(this.state.fields, this.props.account);
      this.cleanUp();
      this.props.closeHandler();
    }
    catch {
      this.props.showMessage("there was an error when saving the account", { autoClose: false, variant: "danger" });
    }
    finally {
      this.setState({waiting: false});
    }
  }
  async deleteHandler(): Promise<void> {
    if (this.props.account) {
      try {
        this.setState({waiting: true});
        await this.props.deleteHandler(this.props.account);
        this.cleanUp();
        this.props.closeHandler();
      }
      catch {
        this.props.showMessage("there was an error when deleting the account", { autoClose: false, variant: "danger" });
      }
      finally {
        this.setState({waiting: false});
      }
    }
  }
  render(): JSX.Element {
    return (
      <div className={styles.AccountEdit} >
        <Col lg={{ span: 2, offset: 5 }} md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
          <h2>{ this.props.account ? 'Edit Account' : 'Add Account' }</h2>
          <Form onSubmit={this.submitForm.bind(this)}>
            <fieldset disabled={this.state.waiting}>
              {this.renderFormFields()}
              <span> <Button variant="secondary" onClick={() => this.props.closeHandler() }><X/> Abort</Button></span>
              <span> <Button variant="primary" type="submit"><Check2/> Store</Button></span>
              { this.props.account && <span> <Button variant="warning" onClick={() => this.deleteHandler()}><Trash/> Delete</Button></span> }
            </fieldset>
          </Form>
        </Col>
      </div>
    );
  }
}

export default AccountEdit;
