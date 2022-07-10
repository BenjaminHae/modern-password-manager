import React, { useState, useEffect } from 'react';
import styles from './UserFieldConfiguration.module.css';
import { UserOptionsFromJSON } from '../../backend/models/UserOptions';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { IUserFieldConfigurationProps } from '../commonProps';

const UserFieldConfiguration: React.FC<IUserFieldConfigurationProps> = (props: IUserFieldConfigurationProps) => {
  const [options, setOptions] = useState(JSON.stringify(props.userOptions, null, 2));
  const [waiting, setWaiting] = useState(false);
  useEffect( () => { setOptions(JSON.stringify(props.userOptions, null, 2)) }, [props.userOptions]);
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
        catch(e: any) {
          props.showMessage(`Couldn't store options: ${e.toString()}`, {variant: "warning"});
        }
      }
      catch(e: any) {
        props.showMessage(`Data does not fit necessary format: ${e.toString()}`, {variant: "warning"});
      }
    }
    catch(e: any) {
      props.showMessage(`Not valid JSON ${e.toString()}`, {variant: "warning"});
    }
    setWaiting(false);
  }
  
  return (
    <Form onSubmit={submit} noValidate className={styles.UserFieldConfiguration} >
      <fieldset disabled={waiting}>
        <Form.Group controlId="UserOptionsForm.Text">
          <Form.Label>Example textarea</Form.Label>
          <Form.Control as="textarea" rows={10} value={ options } onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOptions(e.target.value)} className={styles.Textarea} />
        </Form.Group>
        <Button variant="primary" type="submit">Store</Button>
      </fieldset>
    </Form>
    );
}

export default UserFieldConfiguration;
