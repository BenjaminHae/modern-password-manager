import React from 'react';
import styles from './AccountList.module.css';
import AccountPasswordWithToggle from '../AccountPasswordWithToggle/AccountPasswordWithToggle';
import { Account } from '../../backend/models/account';
import { FieldOptions } from '../../backend/models/fieldOptions';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { PluginSystem } from '../../plugin/PluginSystem';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Plus, Pencil, CaretRightFill } from 'react-bootstrap-icons';
import ShortcutManager from '../../libs/ShortcutManager';

class AccountWithSelected {
  constructor(public account: Account, public id: number, public selected: boolean) {
  }
}

interface AccountListProps {
  accounts: Array<Account>;
  fields: Array<FieldOptions>;
  getAccountPasswordHandler: (account: Account) => Promise<string>;
  editAccountHandler: (account: Account) => void;
  addAccountHandler: () => void;
  selectIndexHandler: (index: number) => void;
  selectedIndex: number;

  pluginSystem: PluginSystem
  shortcuts: ShortcutManager
}
interface AccountListState {
  columns: Array<IDataTableColumn>;
}
class AccountList extends React.Component<AccountListProps, AccountListState> {
  constructor(props: AccountListProps) {
    super(props);
    this.state = {
      columns: this.getColumns()
    }
  }
  componentDidMount(): void {
    const selectAdd = () => { 
      this.props.addAccountHandler();
      return false;
    }
    this.props.shortcuts.addShortcut({ shortcut: "a", action: selectAdd, description: "Show Add Account dialog", component: this} );
    const unselect = () => { 
      if (document.activeElement && (document.activeElement instanceof HTMLElement))
        document.activeElement.blur();
    }
    this.props.shortcuts.addShortcut({ shortcut: "esc", action: unselect, description: "Exit any input", component: this} );
    const selectOffset = (offset:number) => {
      const currentIndex = this.props.selectedIndex;
      let newIndex = currentIndex;
      let arrIndex = this.props.accounts.findIndex((account) => account.index === currentIndex);
      if (arrIndex < 0) {
        arrIndex = 0
        if (this.props.accounts[arrIndex]) {
          newIndex = this.props.accounts[arrIndex].index;
        }
      }
      else if ((arrIndex + offset >= 0) && (arrIndex + offset < this.props.accounts.length)) {
        if (this.props.accounts[arrIndex + offset]) {
          newIndex = this.props.accounts[arrIndex + offset].index;
        }
      }
      this.props.selectIndexHandler(newIndex);
    }
    this.props.shortcuts.addShortcut({ shortcut: ["j", "down"], action: () => selectOffset(1), description: "Select next row", component: this} );
    this.props.shortcuts.addShortcut({ shortcut: ["k", "up"], action: () => selectOffset(-1), description: "Select previous row", component: this} );
    const editCurrentRow = () => {
      const account = this.getAccountByIndex(this.props.selectedIndex);
      if (account)
        this.props.editAccountHandler(account);
    }
    this.props.shortcuts.addShortcut({ shortcut: "e", action: editCurrentRow, description: "Edit current row", component: this} );
    const pluginRowShortcuts = this.props.pluginSystem.accountListShortcuts();
    for (const shortcut of pluginRowShortcuts) {
      const handleShortcut = () => {
        const account = this.getAccountByIndex(this.props.selectedIndex);
        if (account) {
          shortcut.action(account);
        }
        return false;
      }
      this.props.shortcuts.addShortcut({ shortcut: shortcut.shortcut, action: handleShortcut, description: shortcut.description, component: this} );
    }
  }
  componentWillUnmount(): void {
    this.props.shortcuts.removeByComponent(this);
  }
  componentDidUpdate(prevProps: AccountListProps): void {
    if (this.props.fields !== prevProps.fields) {
      this.getColumns();
      this.setState({columns: this.getColumns()});
    }
  }
  getAccountByIndex(index: number): Account|undefined{
    return this.props.accounts.find((account) => account.index === index);
  }
  getTableActions(): JSX.Element {
    return <Button onClick={() => this.props.addAccountHandler()} variant="success" size="sm" ><Plus/> Add Account</Button>
  }
  
  getAccountButtons(account: Account): JSX.Element {
    let buttons : Array <void | JSX.Element> = [<Button key="EditAccountNative" onClick={()=>{this.props.editAccountHandler(account)}}><Pencil/></Button>];
    buttons = this.props.pluginSystem.accountButtons(account).concat(buttons);
    return (
      <ButtonGroup size="sm" className={styles.TableButtonGroup}>
        {buttons}
      </ButtonGroup>
    )
  }
  
  getPasswordButtons(account: Account): JSX.Element {
    const buttons = this.props.pluginSystem.passwordButtons(account);
    return (
      <ButtonGroup size="sm" className={styles.TableButtonGroup} key="buttons">
        {buttons}
      </ButtonGroup>
    )
  }
    
  getColumns(): Array<IDataTableColumn> {
    const columns: Array<IDataTableColumn> = [
      { name: "",
        ignoreRowClick: true,
        cell: (row: AccountWithSelected) => { if (row.selected) { return ( <CaretRightFill/> ) } },
        hide: 'md',
        width: '5em',
        right: true
      },
      { 
        name: "Name", 
        selector: "name", 
        sortable:true,
        cell: (row: AccountWithSelected) => [<>{row.account.name}</>, this.getAccountButtons(row.account)]
      },
      { 
        name: "Password",  
        ignoreRowClick: true, 
        cell: (row: AccountWithSelected) => [ 
          <AccountPasswordWithToggle key="password"
            account={row.account} 
            getAccountPasswordHandler={this.props.getAccountPasswordHandler}
          />, 
          this.getPasswordButtons(row.account)
        ]
      }
    ];
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
      if (!field.visible) {
        continue;
      }
      const column: IDataTableColumn = {
          name: field.name, 
          selector: (row: AccountWithSelected) => row.account.other[field.selector],
          sortable: field.sortable,
          hide: field.hideInTable || 'md'
        };
      if (field.colNumber) {
        //colNumber + 1 to ignore "selectedRow"-column in numbering
        columns.splice(field.colNumber + 1, 0, column);
      }
      else {
        columns.push(column);
      }
    }
    return columns;
  }
  render(): JSX.Element {
    return (
      <div className={ styles.AccountList }>
        <DataTable 
          title="Passwords" 
          columns={ this.state.columns } 
          data={ this.props.accounts.map<AccountWithSelected>(
            (account) => { 
              return new AccountWithSelected(account, account.index, this.props.selectedIndex === account.index); 
            })
          } 
          striped 
          pagination 
          actions={ this.getTableActions() } 
          keyField="id" 
        />
      </div>
    );
  }
}

export default AccountList;
