import React from 'react';
import styles from './WebAuthn.module.css';
import { UserWebAuthnCred } from '@pm-server/pm-server-react-client';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { Plus, Trash } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import PasswordInputWithToggle from '../PasswordInputWithToggle/PasswordInputWithToggle';
import { IMessageOptions } from '../Message/Message';

export interface IWebAuthnProps {
  webAuthnDevices: Array<UserWebAuthnCred>;
  webAuthnThisDeviceRegistered: boolean;
  webAuthnLoadHandler: () => Promise<void>;
  webAuthnCreateCredHandler: (devicename: string, username: string, password: string) => Promise<void>;
  webAuthnDeleteCredHandler: (creds: UserWebAuthnCred) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
}
interface WebAuthnFormValues {
  username: string;
  devicename: string;
  password: string;
}
interface WebAuthnState extends WebAuthnFormValues{
  showDialog: boolean;
  columns: Array<IDataTableColumn>;
}
class WebAuthn extends React.Component<IWebAuthnProps, WebAuthnState> {
  readonly emptyInput = {
    username: "",
    devicename: "",
    password: ""
  }

  constructor(props: IWebAuthnProps) {
    super(props);
    this.state = { 
      ...this.emptyInput, 
      showDialog: false,
      columns: this.getColumns()
    };
    if (props.webAuthnDevices.length === 0) {
      props.webAuthnLoadHandler();
    }
    this.handleGenericChange = this.handleGenericChange.bind(this);
  }
  getColumns(): Array<IDataTableColumn> {
    return [
      {name: 'Device Name', selector: 'name'},
      {
        name: 'Last Used', 
        cell: (row: UserWebAuthnCred) => { 
          if (row.lastUsed) 
            return ( <span>{row.lastUsed.toLocaleString(navigator.language)}</span> ); 
          else 
            return ( <span/> )
        }
      },
      { 
        name: "",  
        ignoreRowClick: true, 
        cell: (row: UserWebAuthnCred) => <Button onClick={()=>{this.props.webAuthnDeleteCredHandler(row)}}><Trash/></Button>
      }
    ];
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.name in (this.state as WebAuthnFormValues)) {
      this.setState({[event.target.name]: event.target.value} as Pick<WebAuthnFormValues, keyof WebAuthnFormValues>);
    }
  }
  setShowDialog = (state: boolean) => {
    this.setState({showDialog: state});
  }
  handleDialogStore = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //props.webAuthnCreateCredHandler()
    try {
      await this.props.webAuthnCreateCredHandler(this.state.devicename, this.state.username, this.state.password);
      this.props.showMessage(`Successfully stored key for ${this.state.devicename}`, {variant : "info"});
      this.handleDialogClose();
    }
    catch(e) {
      this.props.showMessage(`Error when storing key: ${e.message}`, {autoClose: false, variant: "danger"});
      throw(e);
    }
  }
  handleDialogClose = () => {
    this.setShowDialog(false);
    this.setState(this.emptyInput);
  }
  handleDialogShow = () => this.setShowDialog(true);
  
  render (): JSX.Element {
    return (
      <div className={styles.WebAuthn}>
        {!this.props.webAuthnThisDeviceRegistered && 
          <Button onClick={this.handleDialogShow}><Plus/> Register this device </Button>
        }
        <Modal show={this.state.showDialog} onHide={this.handleDialogClose} >
          <Modal.Header closeButton>
            <Modal.Title>Add Login Key</Modal.Title>
          </Modal.Header>
          <Form onSubmit={this.handleDialogStore}>
            <Modal.Body>
              <Form.Group controlId="webAuthnFormUsername">
                <Form.Label>Username (to be shown in authentication dialog)</Form.Label>
                <Form.Control type="text" autoFocus placeholder="Enter Username" name="username" onChange={this.handleGenericChange} required />
              </Form.Group>
              <Form.Group controlId="webAuthnFormDeviceName">
                <Form.Label>Device name to identify this device</Form.Label>
                <Form.Control type="text" autoFocus placeholder="Enter Device Name" name="devicename" onChange={this.handleGenericChange} required />
              </Form.Group>
              <Form.Group controlId="webAuthnFormPassword">
                <Form.Label>Password (your current password)</Form.Label>
                <PasswordInputWithToggle onChange={this.handleGenericChange} value={this.state.password} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleDialogClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {this.props.webAuthnDevices.length > 0 &&
          <div>
            <h4>Stored devices</h4>
            <DataTable noHeader columns={this.state.columns} data={this.props.webAuthnDevices} dense pagination striped/>
          </div>
        }
      </div>
      )
  }
}

export default WebAuthn;
