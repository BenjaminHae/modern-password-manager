import React from 'react';
import styles from './AccountEdit.module.css';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import Button from 'react-bootstrap/Button';

interface AccountEditProps {
  account?: Account;
  fields: Array<FieldOptions>;
  editHandler: (fields: {[index: string]:string}, account?: Account) => Promise<void>;
  closeHandler: () => void;
}
interface AccountEditState {
    fields: {[index: string]:string};
    message: string;
}
class AccountEdit extends React.Component<AccountEditProps, AccountEditState> {
  constructor(props: AccountEditProps) {
    super(props);
    this.handleGenericChange = this.handleGenericChange.bind(this);
    this.state = { fields: this.generateFieldContents(), message: "" };
  }
  componentDidUpdate(prevProps: AccountEditProps) {
    if (this.props.account !== prevProps.account) {
      this.setState({fields: this.generateFieldContents(), message: "" });
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
  handleGenericChange(event: any) {
    let currentFields = this.state.fields;
    currentFields[event.target.name] = event.target.value;
    this.setState({fields: currentFields});
  }
  cleanUp() {
    //todo cleanup
  }
  getFormFields() {
    let fields = [ (
	      <div key="account">
		<div>
		    <label>Account Name
		    <input type="text" placeholder="Account name" name="name" onChange={this.handleGenericChange} value={this.state.fields["name"]} />
		    </label>
		</div>
	      </div>
	   ), 
           (
	      <div key="password">
		<div>
		    <label>Password
		    <input type="text" placeholder="Password" name="password" onChange={this.handleGenericChange} />
		    </label>
		</div>
	      </div>
	   )];
    let sortFunc = (a: FieldOptions, b: FieldOptions) => {
      if (!a.colNumber) {
        return 1;
      }
      if (!b.colNumber) {
        return -1;
      }
      return a.colNumber - b.colNumber
    }
    for (let field of this.props.fields.sort(sortFunc)) {
      let fieldOut = (
	      <div key={field.selector}>
		<div>
		    <label>{field.name}
		    <input type="text" placeholder={field.name} name={field.selector} onChange={this.handleGenericChange} value={this.state.fields[field.selector]} />
		    </label>
		</div>
	      </div>
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
  async submitForm() {
    try {
      await this.props.editHandler(this.state.fields, this.props.account);
      this.cleanUp();
      this.props.closeHandler();
    }
    catch {
      this.setState({message: "there was an error when saving the account"});
    }
  }
  render() {
    return (
      <div>
        <h2>{ this.props.account ? 'Edit Account' : 'Add Account' }</h2>
        <p>{ this.state.message }</p>
        {this.getFormFields()}
	{this.props.account && this.props.account.name}
        <span> <Button onClick={() => {this.props.closeHandler()} }>Abort</Button></span>
        <span> <Button onClick={() => {this.submitForm()} }>store</Button></span>
      </div>
    );
  }
}

export default AccountEdit;
