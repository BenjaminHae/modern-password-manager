import React from 'react';
import styles from './WebAuthn.module.css';
import { UserWebAuthnCred } from '@pm-server/pm-server-react-client';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { Plus, Trash } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PasswordInputWithToggle from '../PasswordInputWithToggle/PasswordInputWithToggle';
import { IWebAuthnProps } from '../commonProps';
import Collapse from 'react-bootstrap/Collapse';
import CloseButton from 'react-bootstrap/CloseButton';
import Col from 'react-bootstrap/Col';

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
    props.webAuthnLoadHandler();
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
        cell: (row: UserWebAuthnCred) => <Button onClick={()=>{this.props.webAuthnDeleteCredHandler(row)}}><Trash/></Button>,
        right: true,
        width: "1em"
      }
    ];
  }
  handleGenericChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.name in (this.state as WebAuthnFormValues)) {
      this.setState({[event.target.name]: event.target.value} as Pick<WebAuthnFormValues, keyof WebAuthnFormValues>);
    }
  }
  setShowDialog = (state: boolean): void => {
    this.setState({showDialog: state});
  }
  handleDialogStore = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    //props.webAuthnCreateCredHandler()
    try {
      const password = this.state.password;
      this.setState({password:""});
      await this.props.webAuthnCreateCredHandler(this.state.devicename, this.state.username, password);
      this.props.showMessage(`Successfully stored key for ${this.state.devicename}`, {variant : "info"});
      this.props.webAuthnLoadHandler();
      this.handleDialogClose();
    }
    catch(e) {
      const message = e instanceof Error ? e.message : e;
      this.props.showMessage(`Error when storing key: ${message}`, {autoClose: false, variant: "danger"});
      throw(e);
    }
  }
  handleDialogClose = (): void => {
    this.setShowDialog(false);
    this.setState(this.emptyInput);
  }
  handleDialogShow = (): void => this.setShowDialog(true);
  
  render (): JSX.Element {
    return (
      <div className={styles.WebAuthn}>
        <p>You can store decryption keys on devices so that you don&apos;t have to enter your password on login.<br/>
          However access to this decryption key is protected by your device, for example through biometric authentication (fingerprint or face recognition).<br/>
          This explanation is quite simplified. For more information look at the documentation of this password manager.</p>
          <Collapse in={ !this.state.showDialog } >
            <Button onClick={this.handleDialogShow}><Plus/> Register current user on this device </Button>
          </Collapse>
        {this.props.webAuthnThisDeviceRegistered && 
          <p>This device is already registered, but it is unknown whether for this user.</p>
        }
        <Collapse in={ this.state.showDialog } >
          <Col xl={{ span: 6 }} lg={{ span: 10 }} md={{ span: 8 }} sm={{ span: 10 }} xs={{ span:11 }} >
            <p><CloseButton onClick={ this.handleDialogClose } /></p>
            <h4>Add Login Key</h4>
            <Form onSubmit={ this.handleDialogStore }>
              <Form.Group controlId="webAuthnFormUsername">
                <Form.Label>Username (not necessarily your current username - only shown locally in authentication dialog)</Form.Label>
                <Form.Control type="text" autoFocus placeholder="Enter Username" name="username" onChange={this.handleGenericChange} required />
              </Form.Group>
              <Form.Group controlId="webAuthnFormDeviceName">
                <Form.Label>Device name to identify this device</Form.Label>
                <Form.Control type="text" placeholder="Enter Device Name" name="devicename" onChange={this.handleGenericChange} required />
              </Form.Group>
              <Form.Group controlId="webAuthnFormPassword">
                <Form.Label>Password (your current password)</Form.Label>
                <PasswordInputWithToggle onChange={this.handleGenericChange} value={this.state.password} required />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </Col>
        </Collapse>
        {this.props.webAuthnDevices.length > 0 &&
          <div className={styles.WebAuthnList}>
            <h4>Stored devices</h4>
            <DataTable noHeader columns={this.state.columns} data={this.props.webAuthnDevices} dense pagination striped/>
          </div>
        }
      </div>
      )
  }
}

export default WebAuthn;
