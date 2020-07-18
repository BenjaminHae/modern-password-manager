import React from 'react';
import styles from './Authenticated.module.css';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import AccountList from '../AccountList/AccountList';
import AccountEdit from '../AccountEdit/AccountEdit';
import ImportCsv from '../ImportCsv/ImportCsv';
import ChangePassword from '../ChangePassword/ChangePassword';
import History from '../History/History';
import { BackendService } from '../../backend/backend.service';
import { AccountTransformerService } from '../../backend/controller/account-transformer.service';
import Button from 'react-bootstrap/Button';
import { PluginSystem } from '../../plugin/PluginSystem';
import PluginMainView from '../../plugin/PluginMainView/PluginMainView';
import { HistoryItem } from '@pm-server/pm-server-react-client';

enum AuthenticatedView {
  List,
  Edit,
  Add,
  Import,
  ChangePassword,
  History
}
interface AuthenticatedProps {
  accounts: Array<Account>,
  fields: Array<FieldOptions>,
  historyItems: Array<HistoryItem>,
  backend: BackendService,
  transformer: AccountTransformerService,
  editHandler: (fields: {[index: string]:string}, account?: Account) => Promise<void>,
  bulkAddHandler: (newFields: Array<{[index: string]:string}>) => Promise<void>,
  deleteHandler: (account: Account) => Promise<void>,
  changePasswordHandler: (oldPassword: string, newPassword: string) => Promise<void>,
  pluginSystem: PluginSystem,
  showMessage: (message: string, important?: boolean, clickHandler?: () => void) => void,
  loadHistoryHandler: () => Promise<void>;
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
        <p className={styles.Selectors}>
          <Button onClick={this.historySelect.bind(this)}>History</Button>
        </p>
        {this.renderSwitchAuthenticatedView()}
      </div>
    );
  }
  renderSwitchAuthenticatedView() {
    switch(this.state.view) {
      case AuthenticatedView.List:
        return (
          <>
            <PluginMainView pluginSystem={this.props.pluginSystem} />
            <AccountList accounts={this.props.accounts} transformer={this.props.transformer} fields={this.props.fields} editAccountHandler={this.editAccountSelect.bind(this)} addAccountHandler={this.addAccountSelect.bind(this)} pluginSystem={this.props.pluginSystem} />
          </>
        );
      case AuthenticatedView.Edit:
        return (
          <AccountEdit account={this.state.selectedAccount} fields={this.props.fields} editHandler={this.props.editHandler}  closeHandler={this.backToListView.bind(this)} deleteHandler={this.props.deleteHandler} transformer={this.props.transformer} showMessage={this.props.showMessage}/>
        );
      case AuthenticatedView.Add:
        return (
          <AccountEdit account={undefined} fields={this.props.fields} editHandler={this.props.editHandler} closeHandler={this.backToListView.bind(this)} deleteHandler={this.props.deleteHandler} transformer={this.props.transformer} showMessage={this.props.showMessage} />
        );
      case AuthenticatedView.History:
        return (
          <History historyItems={this.props.historyItems} />
        );
      case AuthenticatedView.ChangePassword:
        return (
          <ChangePassword changePasswordHandler={this.props.changePasswordHandler} showMessage={this.props.showMessage}/>
        );
      case AuthenticatedView.Import:
        return (
          <ImportCsv availableFields={this.props.fields} bulkAddHandler={this.props.bulkAddHandler} showMessage={this.props.showMessage}/>
        );
    }
  }
  editAccountSelect(account: Account) {
    this.setState({view: AuthenticatedView.Edit, selectedAccount: account});
  }
  addAccountSelect() {
    this.setState({view: AuthenticatedView.Add});
  }
  historySelect(): void {
    this.props.loadHistoryHandler();
    this.setState({view: AuthenticatedView.History});
  }
  backToListView() {
    this.setState(this.defaultViewState());
  }
}
export default Authenticated;
