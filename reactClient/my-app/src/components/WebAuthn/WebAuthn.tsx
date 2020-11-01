import React, { useEffect } from 'react';
import styles from './WebAuthn.module.css';
import { UserWebAuthnCred } from '@pm-server/pm-server-react-client';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { Plus, Trash } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';

export interface IWebAuthnProps {
  webAuthnDevices: Array<UserWebAuthnCred>;
  webAuthnThisDeviceRegistered: boolean;
  webAuthnLoadHandler: () => Promise<void>;
  webAuthnCreateCredHandler: () => Promise<void>;
  webAuthnDeleteCredHandler: (creds: UserWebAuthnCred) => Promise<void>;
}
const WebAuthn: React.FC<IWebAuthnProps> = (props: IWebAuthnProps) => {
  const columns: Array<IDataTableColumn> = [
    {name: 'Device Name', selector: 'name'},
    {name: 'Last Used', cell: () => <>not implemented</>},
    { 
      name: "",  
      ignoreRowClick: true, 
      cell: (row: UserWebAuthnCred) => <Button onClick={()=>{props.webAuthnDeleteCredHandler(row)}}><Trash/></Button>
    }
  ];

  useEffect(() => {
    if (props.webAuthnDevices.length === 0) {
      props.webAuthnLoadHandler();
    }
  });

  return (
      <div className={styles.WebAuthn}>
        <h3>Login without password</h3>
        {!props.webAuthnThisDeviceRegistered && 
          <Button onClick={() => {props.webAuthnCreateCredHandler()}}><Plus/> Register this device </Button>
        }
        {props.webAuthnDevices.length > 0 &&
          <div>
            <h4>Stored devices</h4>
            <DataTable noHeader columns={columns} data={props.webAuthnDevices} dense pagination striped/>
          </div>
        }
      </div>
      )
};

export default WebAuthn;
