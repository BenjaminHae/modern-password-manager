import React from 'react';
import styles from './Authenticated.module.css';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import AccountList from '../AccountList/AccountList';
import AccountEdit from '../AccountEdit/AccountEdit';
import { BackendService } from '../../backend/backend.service';
import { AccountTransformerService } from '../../backend/controller/account-transformer.service';
import Button from 'react-bootstrap/Button';

enum AuthenticatedView {
  List,
  Edit,
  Add
}
interface AuthenticatedProps {
  accounts: Array<Account>;
  fields: Array<FieldOptions>;
  backend: BackendService;
  transformer: AccountTransformerService;
  editHandler: (fields: {[index: string]:string}, account?: Account) => Promise<void>;
}
interface AuthenticatedState {
  view: AuthenticatedView;
  selectedAccount?: Account;
}
class Authenticated extends React.Component<AuthenticatedProps, AuthenticatedState> {
  constructor(props: AuthenticatedProps) {
    super(props);
    this.state = this.defaultViewState();
  }
  defaultViewState(): AuthenticatedState {
    return {
      view: AuthenticatedView.List,
      selectedAccount: undefined
    }
  }
  render () {
    return (
	  <div className={styles.Authenticated}>
	    Authenticated Component
            <p><Button onClick={this.addAccountHandler.bind(this)}>Add Account</Button></p>
                {this.renderSwitchAuthenticatedView()}
	  </div>
	);
  }
  renderSwitchAuthenticatedView() {
    switch(this.state.view) {
      case AuthenticatedView.List:
        return (
		<AccountList accounts={this.props.accounts} transformer={this.props.transformer} fields={this.props.fields} editAccountHandler={this.editAccountHandler.bind(this)}/>
        );
      case AuthenticatedView.Edit:
        return (
		<AccountEdit account={this.state.selectedAccount} fields={this.props.fields} editHandler={this.props.editHandler}  closeHandler={this.backToListView.bind(this)} />
        );
      case AuthenticatedView.Add:
        return (
		<AccountEdit account={undefined} fields={this.props.fields} editHandler={this.props.editHandler} closeHandler={this.backToListView.bind(this)} />
        );
    }
  }
  editAccountHandler(account: Account) {
    this.setState({view: AuthenticatedView.Edit, selectedAccount: account});
  }
  addAccountHandler() {
    this.setState({view: AuthenticatedView.Add});
  }
  backToListView() {
    this.setState(this.defaultViewState());
  }
}
export default Authenticated;
