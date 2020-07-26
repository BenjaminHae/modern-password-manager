import React, { useState } from 'react';
import styles from './UserConfiguration.module.css';
import { UserOptions, UserOptionsFromJSON } from '../../backend/models/UserOptions';
import { IMessageOptions } from '../Message/Message';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

interface UserConfigurationProps {
  options: UserOptions;
  showMessage: (message: string, options: IMessageOptions) => void;
  doStoreOptions: (options: UserOptions) => Promise<void>;
}
const UserConfiguration: React.FC<UserConfigurationProps> = (props: UserConfigurationProps) => {
  const [options, setOptions] = useState(JSON.stringify(props.options, null, 2));
  const [waiting, setWaiting] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setWaiting(true);
    try {
      const data = JSON.parse(options);
      try {
        const userOptions = UserOptionsFromJSON(data);
        try {
          await props.doStoreOptions(userOptions);
          props.showMessage("stored options", {variant: "success"});
        }
        catch(e) {
          props.showMessage(`Couldn't store options: ${e.toString()}`, {variant: "warning"});
        }
      }
      catch(e) {
        props.showMessage(`Data does not fit necessary format: ${e.toString()}`, {variant: "warning"});
      }
    }
    catch(e) {
      props.showMessage(`Not valid JSON ${e.toString()}`, {variant: "warning"});
    }
    setWaiting(false);
  }
  
  return (
    <div className={styles.UserConfiguration}>
      <Col lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} sm={{ span: 12 }}>
        <h3>User Options</h3>
        <Form onSubmit={submit} noValidate>
          <fieldset disabled={waiting}>
            <Form.Group controlId="UserOptionsForm.Text">
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={20} value={ options } onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOptions(e.target.value)} className={styles.Textarea} />
            </Form.Group>
            <Button variant="primary" type="submit">Store</Button>
          </fieldset>
        </Form>
      </Col>
    </div>
    );
}

export default UserConfiguration;
