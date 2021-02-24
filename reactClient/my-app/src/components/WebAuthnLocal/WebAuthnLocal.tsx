import React from 'react';
import styles from './WebAuthnLocal.module.css';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import PersistDecryptionKey, { IKeyInfo } from '../../libs/PersistDecryptionKey';
import { Trash } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import { WebAuthnLocalProps } from '../commonProps';

interface WebAuthnLocalState {
  keys: Array<IKeyInfo>;
  columns: Array<IDataTableColumn>;
}
class WebAuthnLocal extends React.Component<WebAuthnLocalProps, WebAuthnLocalState> {
  private persistor = new PersistDecryptionKey();
  constructor(props: WebAuthnLocalProps) {
    super(props);
    this.state = { keys: [], columns: this.getColumns() };
  }
  componentDidMount() {
    this.loadKeys();
  }
  getColumns(): Array<IDataTableColumn> {
    return [
      {
        name: '', 
        cell: (row: IKeyInfo) => ( <Button variant="danger" size="sm" onClick={() => this.deleteKey(row.id)}><Trash/></Button> ),
        width: "4em"
      },
      {name: 'Display Name', selector: 'displayName'},
      {
        name: 'Last Used', 
        cell: (row: IKeyInfo) => { 
          if (row.lastUsed) 
            return ( <span>{row.lastUsed.toLocaleString(navigator.language)}</span> ); 
          else 
            return ( <span/> )
        }
      }
    ];
  }
  async loadKeys(): Promise<void> {
    this.setState({keys: await this.persistor.getKeyList() });
  }
  async deleteKey(id: number): Promise<void> {
    await this.persistor.removeKeys(id);
    await this.loadKeys();
  }
  
  render (): JSX.Element {
    return (
      <div className={styles.WebAuthnLocal}>
      <Button disabled={!this.props.ready} onClick={()=>this.props.autoLogin()}>Try Auto-Login</Button>
      <p>The following keys are stored in the browser for logon without password.</p>
        <DataTable noHeader columns={this.state.columns} data={this.state.keys} striped/>
      </div>
      )
  }
}

export default WebAuthnLocal;
