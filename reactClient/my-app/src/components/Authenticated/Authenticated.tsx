import React from 'react';
import styles from './Authenticated.module.css';
import { Account } from '../../backend/models/account';
import { ILogonInformation } from '../../backend/api/user.service';
import { IMessageOptions } from '../../libs/MessageManager';
import AccountList from '../AccountList/AccountList';
import AccountEdit from '../AccountEdit/AccountEdit';
import ImportCsv from '../ImportCsv/ImportCsv.lazy';
import ExportCsv from '../ExportCsv/ExportCsv.lazy';
import History from '../History/History';
import UserSettings from '../UserSettings/UserSettings';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { BoxArrowUpLeft, CloudArrowUp, CloudArrowDown, List, Plus, PencilFill, ClockHistory, Sliders } from 'react-bootstrap-icons';
import PluginMainView from '../../plugin/PluginMainView/PluginMainView';
import IdleTimer from 'react-idle-timer';
import { IAuthenticatedProps } from '../commonProps';

enum AuthenticatedView {
  List,
  Edit,
  Add,
  Import,
  Export,
  Options,
  History
}
interface AuthenticatedState {
  view: AuthenticatedView;
  selectedAccount?: Account;
  selectedIndex: number;
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
  private idleTimer = React.createRef<IdleTimer>();
  constructor(props: IAuthenticatedProps) {
    super(props);
    this.state = this.defaultViewState();
    this.props.pluginSystem.registerAuthenticatedUIHandler(this);
  }
  componentDidUpdate(prevProps: IAuthenticatedProps): void {
    if (this.props.logonInformation && prevProps.logonInformation !== this.props.logonInformation) {
      this.showLogonInformation(this.props.logonInformation);
    }
  }
  // this has to stay here because of the button for changing the view :(
  showLogonInformation(info: ILogonInformation): void {
    const options: IMessageOptions = {};
    let message = "";
    if (info.lastLogin) {
      message += `Your last login was on ${info.lastLogin.toLocaleString(navigator.language)}. `;
      options.variant = "info";
    }
    if (info.failedLogins && info.failedLogins > 0) {
      message += `There were ${info.failedLogins} failed logins.`
        options.autoClose = false;
      options.variant = "danger";
      options.button = { variant: "info",  text: "More Information", handler: () => { this.selectView(AuthenticatedView.History) } };
    }
    this.props.showMessage(message, options);
  }
  defaultViewState(): AuthenticatedState {
    return {
      view: AuthenticatedView.List,
      selectedAccount: undefined,
      selectedIndex: 0
    }
  }
  selectIndex(index: number): void {
    this.setState({selectedIndex: index});
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
        <IdleTimer
          ref={ this.idleTimer }
          timeout={ this.props.idleTimeout }
          onIdle={ this.props.onIdle }
          events={ [ 'keydown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'MSPointerDown', 'MSPointerMove', 'visibilitychange' ] }
        />
        <Container fluid >{this.renderSelectors()}</Container>
        <Container fluid className={styles.ListFluid}>{this.renderSwitchAuthenticatedView()}</Container>
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
            <PluginMainView 
              pluginSystem={this.props.pluginSystem} 
            />
            <AccountList 
              accounts={this.props.accounts} 
              fields={this.props.userOptions.fields} 
              editAccountHandler={this.editAccountSelect.bind(this)} 
              addAccountHandler={this.addAccountSelect.bind(this)} 
              pluginSystem={this.props.pluginSystem} 
              shortcuts={this.props.shortcuts} 
              getAccountPasswordHandler={this.props.getAccountPasswordHandler}
              selectedIndex={this.state.selectedIndex}
              selectIndexHandler={this.selectIndex.bind(this)}
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
            {...this.props}
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
