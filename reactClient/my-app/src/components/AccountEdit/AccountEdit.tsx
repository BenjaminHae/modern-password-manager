import React from 'react';
import styles from './AccountEdit.module.css';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import { IMessageOptions } from '../Message/Message';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { Eye } from 'react-bootstrap-icons';

interface AccountEditProps {
  account?: Account;
  fields: Array<FieldOptions>;
  editHandler: (fields: {[index: string]:string}, account?: Account) => Promise<void>;
  deleteHandler: (account: Account) => Promise<void>;
  closeHandler: () => void;
  getAccountPasswordHandler: (account: Account) => Promise<string>;
  showMessage: (message: string, options: IMessageOptions) => void,
}
interface AccountEditState {
  fields: {[index: string]:string};
  waiting: boolean;
}
class AccountEdit extends React.Component<AccountEditProps, AccountEditState> {

  constructor(props: AccountEditProps) {
    super(props);
    this.handleGenericChange = this.handleGenericChange.bind(this);
    this.state = { fields: this.generateFieldContents(), waiting: false};
  }

  componentDidUpdate(prevProps: AccountEditProps) {
    if (this.props.account !== prevProps.account) {
      this.setState({fields: this.generateFieldContents()});
    }
  }

  generateFieldContents(): {[index: string]:string} {
    let newFields: {[index: string]:string} = { name: "", password: "" };
    for (let item of this.props.fields) {
      newFields[item.selector] = "";
    }
    if (this.props.account) {
      newFields["name"] = this.props.account.name;
      for (let otherKey in this.props.account.other) {
        newFields[otherKey] = this.props.account.other[otherKey];
      }
    }
    return newFields;
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>) {
    let currentFields = this.state.fields;
    currentFields[event.target.name] = event.target.value;
    this.setState({fields: currentFields});
  }
  cleanUp() {
    let newFields: {[index: string]:string} = { name: "", password: "" };
    for (let item of this.props.fields) {
      newFields[item.selector] = "";
    }
    this.setState({fields: newFields});
  }
  async showPassword() {
    if (this.props.account) {
      let currentFields = this.state.fields;
      currentFields["password"] = await this.props.getAccountPasswordHandler(this.props.account);
      this.setState({fields: currentFields});
    }
  }
  renderFormFields() {
    let fields = [ (
        <Form.Group controlId="formUsername" key="account">
          <Form.Label>Account Name</Form.Label>
          <Form.Control type="text" placeholder="Account name" name="name" onChange={this.handleGenericChange} value={this.state.fields["name"]} />
        </Form.Group>
	   ), 
           (
        <Form.Group controlId="formPassword" key="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control type="text" placeholder="Password" name="password" onChange={this.handleGenericChange} value={this.state.fields["password"]} />
            {this.props.account && 
              <InputGroup.Append>
                <Button variant="info" onClick={this.showPassword.bind(this)}><Eye/></Button>
              </InputGroup.Append>
            }
          </InputGroup>
        </Form.Group>
	   )];
    let sortFunc = (a: FieldOptions, b: FieldOptions) => {
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
    for (let field of this.props.fields.sort(sortFunc)) {
      let fieldOut = (
        <Form.Group controlId={"form" + field.selector} key={field.selector} >
          <Form.Label>{field.name}</Form.Label>
          <Form.Control type="text" placeholder={field.name} name={field.selector} onChange={this.handleGenericChange} value={this.state.fields[field.selector]} />
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
  async submitForm(event: React.FormEvent) {
    try {
      event.preventDefault();
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
  async deleteHandler() {
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
  render() {
    return (
      <div className={styles.AccountEdit} >
        <Col lg={{ span: 2, offset: 5 }} md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
          <h2>{ this.props.account ? 'Edit Account' : 'Add Account' }</h2>
          <Form onSubmit={this.submitForm.bind(this)}>
            <fieldset disabled={this.state.waiting}>
              {this.renderFormFields()}
              <span> <Button variant="secondary" onClick={() => {this.props.closeHandler()} }>Abort</Button></span>
              <span> <Button variant="primary" type="submit">store</Button></span>
              { this.props.account && <span> <Button variant="warning" onClick={this.deleteHandler.bind(this)}>delete</Button></span> }
            </fieldset>
          </Form>
        </Col>
      </div>
    );
  }
}

export default AccountEdit;
