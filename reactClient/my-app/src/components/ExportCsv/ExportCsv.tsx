import React from 'react';
import styles from './ExportCsv.module.css';
import { Account } from '../../backend/models/account';
import { unparse } from 'papaparse';
import PasswordInputWithToggle from '../PasswordInputWithToggle/PasswordInputWithToggle';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { IExportCsvProps } from '../commonProps';

const generateCSV = async (accounts: Array<Account>, getPassword: (account:Account) => Promise<string>): Promise<string> => {
  const csvObjectsPromise = accounts.map(async (account: Account) => {
      const data: {[index: string]:string} = {};
      data["name"] = account.name;
      data["password"] = await getPassword(account);
      for (const item in account.other) {
        data[item] = account.other[item];
      }
      return data;
    });
  const csvObjects = await Promise.all(csvObjectsPromise);
  const csv = unparse(csvObjects, {quotes: true});
  return csv;
}

const downloadTextFile = (content: string, name: string, mime = "text/plain") => {
  const element = document.createElement("a");
  const file = new Blob([content], {type: mime});
  element.href = URL.createObjectURL(file);
  element.download = name;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
}

const downloadCSV = async (accounts: Array<Account>, getPassword: (account:Account) => Promise<string>): Promise<void> => {
  downloadTextFile(await generateCSV(accounts, getPassword), 'accounts.csv', 'text/csv');
}

const ExportCsv: React.FC<IExportCsvProps> = (props: IExportCsvProps) => {
  const [password, setPassword] = React.useState("");
  const verifyPasswordAndDownloadCsv = async () => {
    const storedPassword = password;
    setPassword("");
    if (await props.verifyPassword(storedPassword)) {
      downloadCSV(props.accounts, props.getAccountPasswordHandler)
    }
    else {
      props.showMessage('Entered password is not correct', {variant: "warning"});
    }
  }
  return (
  <div className={styles.ExportCsv}>
    <Col lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} sm={{ span: 12 }}>
      <h3>Export Accounts</h3>
      <p>Exports data as CSV file containing all passwords in plain text.</p>
      <Form.Group controlId="changePwNewPassword">
        <Form.Label>Please enter your current password first:</Form.Label>
        <PasswordInputWithToggle onChange={(e)=>setPassword(e.target.value)} placeholder="Password" name="password" value={password} />
      </Form.Group>
      <Button onClick={() => verifyPasswordAndDownloadCsv()}>
        Export CSV
      </Button>
    </Col>
  </div>
);
}

export default ExportCsv;
