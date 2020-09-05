import React from 'react';
import styles from './Authenticated.module.css';
import { Account } from '../../backend/models/account';
import { UserOptions } from '../../backend/models/UserOptions';
import { IMessageOptions } from '../Message/Message';
import AccountList from '../AccountList/AccountList';
import AccountEdit from '../AccountEdit/AccountEdit';
import UserConfiguration from '../UserConfiguration/UserConfiguration';
import ImportCsv from '../ImportCsv/ImportCsv';
import ChangePassword from '../ChangePassword/ChangePassword';
import History from '../History/History';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { BoxArrowUpLeft } from 'react-bootstrap-icons';
import { PluginSystem } from '../../plugin/PluginSystem';
import PluginMainView from '../../plugin/PluginMainView/PluginMainView';
import { HistoryItem } from '@pm-server/pm-server-react-client';

enum AuthenticatedView {
  List,
  Edit,
  Add,
  Import,
  Options,
  ChangePassword,
  History
}
interface AuthenticatedProps {
  accounts: Array<Account>,
  historyItems: Array<HistoryItem>,
  userOptions: UserOptions,
  editHandler: (fields: {[index: string]:string}, account?: Account) => Promise<void>,
  bulkAddHandler: (newFields: Array<{[index: string]:string}>) => Promise<void>,
  deleteHandler: (account: Account) => Promise<void>,
  changePasswordHandler: (oldPassword: string, newPassword: string) => Promise<void>,
  getAccountPasswordHandler: (account: Account) => Promise<string>,
  pluginSystem: PluginSystem,
  showMessage: (message: string, options?: IMessageOptions) => void,
  loadHistoryHandler: () => Promise<void>;
  doStoreOptions: (options: UserOptions) => Promise<void>;
}
interface AuthenticatedState {
  view: AuthenticatedView;
  selectedAccount?: Account;
  addAccountProposals?: {[index: string]:string};
}
class Authenticated extends React.Component<AuthenticatedProps, AuthenticatedState> {
  readonly viewButtons = [
    { view: AuthenticatedView.List, name: "Account List", selectable: true },
    { view: AuthenticatedView.Import, name: "Import Accounts", selectable: true },
    { view: AuthenticatedView.ChangePassword, name: "Change Password", selectable: true  },
    { view: AuthenticatedView.Options, name: "Customization", selectable: true  },
    { view: AuthenticatedView.History, name: "History", selectable: true  },
    { view: AuthenticatedView.Edit, name: "Edit Account", selectable: false  },
    { view: AuthenticatedView.Add, name: "Add Account", selectable: false  },
  ];
  constructor(props: AuthenticatedProps) {
    super(props);
    this.state = this.defaultViewState();
    this.props.pluginSystem.registerAuthenticatedUIHandler(this);
  }
  defaultViewState(): AuthenticatedState {
    return {
      view: AuthenticatedView.List,
      selectedAccount: undefined
    }
  }
  selectView(view: AuthenticatedView): void {
    this.setState({view: view});
  }
  editAccountSelect(account: Account): void {
    this.setState({view: AuthenticatedView.Edit, selectedAccount: account});
  }
  addAccountSelect(proposals?: {[index: string]:string}): void {
    this.setState({
        view: AuthenticatedView.Add, 
        addAccountProposals: proposals,
        selectedAccount: undefined
      });
  }
  render (): JSX.Element {
    return (
      <div className={styles.Authenticated}>
        <Container fluid >{this.renderSelectors()}</Container>
        <Container fluid>{this.renderSwitchAuthenticatedView()}</Container>
      </div>
    );
  }
  renderSelectors(): JSX.Element {
    const buttons = this.viewButtons.filter((viewButton)=>viewButton.selectable).map((viewButton)=>{
      return (
        <Dropdown.Item key={viewButton.view} onSelect={()=>{this.selectView(viewButton.view)}} active={this.state.view === viewButton.view }>{viewButton.name}</Dropdown.Item>
      )
    });
    return (
      <Dropdown as={ButtonGroup} className={styles.Selectors}>
        <DropdownButton title={this.viewButtons.filter((viewButton)=>viewButton.view === this.state.view)[0].name} id="dropdownView" variant="secondary">
          {buttons}
        </DropdownButton>
        {this.state.view !== AuthenticatedView.List && <Button variant="info" onClick={()=>this.selectView(AuthenticatedView.List)} ><BoxArrowUpLeft/></Button> }
      </Dropdown>
    )
  }
  renderSwitchAuthenticatedView(): JSX.Element {
    switch(this.state.view) {
      case AuthenticatedView.List:
        return (
          <>
            <PluginMainView pluginSystem={this.props.pluginSystem} />
            <AccountList 
              accounts={this.props.accounts} 
              getAccountPasswordHandler={this.props.getAccountPasswordHandler}
              fields={this.props.userOptions.fields} 
              editAccountHandler={this.editAccountSelect.bind(this)} 
              addAccountHandler={this.addAccountSelect.bind(this)} 
              pluginSystem={this.props.pluginSystem} 
            />
          </>
        );
      case AuthenticatedView.Edit:
        return (
            <AccountEdit 
              account={this.state.selectedAccount} 
              fields={this.props.userOptions.fields} 
              editHandler={this.props.editHandler} 
              closeHandler={()=>this.selectView(AuthenticatedView.List)} 
              deleteHandler={this.props.deleteHandler} 
              getAccountPasswordHandler={this.props.getAccountPasswordHandler}
              showMessage={this.props.showMessage}
            />
        );
      case AuthenticatedView.Add:
        return (
            <AccountEdit 
              account={undefined} 
              fields={this.props.userOptions.fields} 
              editHandler={this.props.editHandler} 
              closeHandler={()=>this.selectView(AuthenticatedView.List)} 
              deleteHandler={this.props.deleteHandler} 
              getAccountPasswordHandler={this.props.getAccountPasswordHandler}
              showMessage={this.props.showMessage}
              proposals={this.state.addAccountProposals}
            />
        );
      case AuthenticatedView.History:
        return (
          <History historyItems={this.props.historyItems} loadHistoryHandler={this.props.loadHistoryHandler} />
        );
      case AuthenticatedView.ChangePassword:
        return (
          <ChangePassword changePasswordHandler={this.props.changePasswordHandler} showMessage={this.props.showMessage}/>
        );
      case AuthenticatedView.Import:
        return (
          <ImportCsv availableFields={this.props.userOptions.fields} bulkAddHandler={this.props.bulkAddHandler} showMessage={this.props.showMessage}/>
        );
      case AuthenticatedView.Options:
        return (
          <UserConfiguration 
            options={this.props.userOptions} 
            showMessage={this.props.showMessage}
            doStoreOptions={this.props.doStoreOptions}
          />
        );
    }
  }
}
export default Authenticated;
