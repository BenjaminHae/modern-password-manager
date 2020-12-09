import React from 'react';
import styles from './Authenticated.module.css';
import { Account } from '../../backend/models/account';
import { IMessageOptions } from '../Message/Message';
import AccountList from '../AccountList/AccountList';
import AccountEdit from '../AccountEdit/AccountEdit';
import ImportCsv from '../ImportCsv/ImportCsv';
import ExportCsv from '../ExportCsv/ExportCsv';
import History from '../History/History';
import UserSettings from '../UserSettings/UserSettings';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { BoxArrowUpLeft, CloudArrowUp, CloudArrowDown, List, Plus, PencilFill, ClockHistory, Sliders } from 'react-bootstrap-icons';
import { PluginSystem } from '../../plugin/PluginSystem';
import PluginMainView from '../../plugin/PluginMainView/PluginMainView';
import { IUserSettingsProps } from '../UserSettings/UserSettings';
import { IHistoryProps } from '../History/History';
import ShortcutManager from '../../libs/ShortcutManager';

enum AuthenticatedView {
  List,
  Edit,
  Add,
  Import,
  Export,
  Options,
  History
}
interface IAuthenticatedProps extends IUserSettingsProps, IHistoryProps {
  accounts: Array<Account>,
  editAccountHandler: (fields: {[index: string]:string}, account?: Account) => Promise<void>,
  bulkAddHandler: (newFields: Array<{[index: string]:string}>) => Promise<void>,
  deleteAccountHandler: (account: Account) => Promise<void>,
  getAccountPasswordHandler: (account: Account) => Promise<string>,

  showMessage: (message: string, options?: IMessageOptions) => void,

  pluginSystem: PluginSystem,
  shortcuts: ShortcutManager
}
interface AuthenticatedState {
  view: AuthenticatedView;
  selectedAccount?: Account;
  addAccountProposals?: {[index: string]:string};
}
class Authenticated extends React.Component<IAuthenticatedProps, AuthenticatedState> {
  readonly viewButtons = [
    { view: AuthenticatedView.List, name: "Account List", icon: (<List/>), selectable: true },
    { view: AuthenticatedView.Import, name: "Import Accounts", icon: (<CloudArrowUp/>), selectable: true },
    { view: AuthenticatedView.Export, name: "Export Accounts", icon: (<CloudArrowDown/>), selectable: true },
    { view: AuthenticatedView.Options, name: "Settings", icon: (<Sliders/>), selectable: true  },
    { view: AuthenticatedView.History, name: "History", icon: (<ClockHistory/>), selectable: true },
    { view: AuthenticatedView.Edit, name: "Edit Account", icon: (<PencilFill/>), selectable: false },
    { view: AuthenticatedView.Add, name: "Add Account", icon: (<Plus/>), selectable: false },
  ];
  constructor(props: IAuthenticatedProps) {
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
        <Dropdown.Item key={viewButton.view} onSelect={()=>{this.selectView(viewButton.view)}} active={this.state.view === viewButton.view }>{viewButton.icon && viewButton.icon } {viewButton.name}</Dropdown.Item>
      )
    });
    const currentButton = this.viewButtons.filter((viewButton)=>viewButton.view === this.state.view)[0];
    const currentTitle = (
      <>{currentButton.icon && currentButton.icon } {currentButton.name}</>
    )
    return (
      <Dropdown as={ButtonGroup} className={styles.Selectors}>
        <DropdownButton title={currentTitle} id="dropdownView" variant="secondary">
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
              fields={this.props.userOptions.fields} 
              editAccountHandler={this.editAccountSelect.bind(this)} 
              addAccountHandler={this.addAccountSelect.bind(this)} 
              pluginSystem={this.props.pluginSystem} 
              shortcuts={this.props.shortcuts} 
              getAccountPasswordHandler={this.props.getAccountPasswordHandler}
            />
          </>
        );
      case AuthenticatedView.Edit:
        return (
            <AccountEdit 
              account={this.state.selectedAccount} 
              fields={this.props.userOptions.fields} 
              closeHandler={()=>this.selectView(AuthenticatedView.List)} 
              {...this.props}
            />
        );
      case AuthenticatedView.Add:
        return (
            <AccountEdit 
              account={undefined} 
              proposals={this.state.addAccountProposals}
              fields={this.props.userOptions.fields} 
              closeHandler={()=>this.selectView(AuthenticatedView.List)} 
              {...this.props}
            />
        );
      case AuthenticatedView.History:
        return (
          <History historyItems={this.props.historyItems} loadHistoryHandler={this.props.loadHistoryHandler} />
        );
      case AuthenticatedView.Import:
        return (
          <ImportCsv 
            availableFields={this.props.userOptions.fields} 
            bulkAddHandler={this.props.bulkAddHandler} 
            showMessage={this.props.showMessage}
          />
        );
      case AuthenticatedView.Export:
        return (
          <ExportCsv 
            accounts={this.props.accounts}
            getAccountPasswordHandler={this.props.getAccountPasswordHandler}
          />
        );
      case AuthenticatedView.Options:
        return (
          <UserSettings 
            {...this.props}
          />
        );
    }
  }
}
export default Authenticated;
