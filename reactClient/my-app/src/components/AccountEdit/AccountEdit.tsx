import React from 'react';
import styles from './AccountEdit.module.css';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import { PluginSystem } from '../../plugin/PluginSystem';
import { IMessageOptions } from '../../libs/MessageManager';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { Eye, X, Check2, Trash } from 'react-bootstrap-icons';
import ShortcutManager from '../../libs/ShortcutManager';
import { ExtendedKeyboardEvent }from 'mousetrap';

interface AccountEditProps {
  account?: Account;
  proposals?: {[index: string]:string};
  fields: Array<FieldOptions>;
  editAccountHandler: (fields: {[index: string]:string}, account?: Account) => Promise<void>;
  deleteAccountHandler: (account: Account) => Promise<void>;
  closeHandler: () => void;
  getAccountPasswordHandler: (account: Account) => Promise<string>;
  showMessage: (message: string, options: IMessageOptions) => void;
  pluginSystem: PluginSystem;

  shortcuts: ShortcutManager
}
interface AccountEditState {
  fields: {[index: string]:string};
  waiting: boolean;
  showDelete: boolean;
}
class AccountEdit extends React.Component<AccountEditProps, AccountEditState> {

  constructor(props: AccountEditProps) {
    super(props);
    this.state = { fields: this.generateFieldContents(), waiting: false, showDelete: false};
  }
  componentDidMount(): void {
    const quit = (e: ExtendedKeyboardEvent) => { 
      e.preventDefault();
      this.props.closeHandler()
    }
    this.props.shortcuts.addShortcut({ shortcut: "esc", action: quit, description: "Close Dialog", component: this} );
  }
  componentWillUnmount(): void {
    this.props.shortcuts.removeByComponent(this);
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
      // if a default value is defined
      if (item.defaultValue) {
        newFields[item.selector] = item.defaultValue;
      }
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
  getButtons(inputKey: string, currentValue: string, account?: Account): Array<JSX.Element> {
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
            <Form.Control type="text" placeholder="Password" name="password" autoComplete="new-password" onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.handleGenericChangeByChangeEvent(event)} value={this.state.fields["password"]} />
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
            <Form.Control type="text" placeholder={field.hint || field.name} name={field.selector} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.handleGenericChangeByChangeEvent(event)} value={this.state.fields[field.selector]} /> 
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
      await this.props.editAccountHandler(this.state.fields, this.props.account);
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
        await this.props.deleteAccountHandler(this.props.account);
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
              { this.props.account && <span> <Button variant="warning" onClick={() => this.setState({showDelete:true})}><Trash/> Delete</Button></span> }
            </fieldset>
          </Form>
          <Modal show={ this.state.showDelete } onHide={() => this.setState({showDelete: false})}>
            <Modal.Header>
              <Modal.Title>Delete?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Do you really want to delete this account?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.setState({showDelete: false})}>Abort</Button>
              <Button variant="danger" onClick={() => this.deleteHandler()}><Trash/> Delete</Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </div>
    );
  }
}

export default AccountEdit;
