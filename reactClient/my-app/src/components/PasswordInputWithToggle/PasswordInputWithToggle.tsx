import React, { useState } from 'react';
import styles from './PasswordInputWithToggle.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

interface PasswordProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
}
const PasswordInputWithToggle: React.FC<PasswordProps> = (props: PasswordProps) => {
  const [visible, setVisible] = useState(false);
  
  return (
    <InputGroup>
      <Form.Control type={visible ? "text": "password" } placeholder={ props.placeholder || "Enter Password" } name={ props.name || "password" } onChange={props.onChange}/>
      <InputGroup.Append>
        <Button variant="info" onClick={()=>setVisible(!visible)}>{visible ? <EyeSlash/> : <Eye/> }</Button>
      </InputGroup.Append>
    </InputGroup>
  );
}

export default PasswordInputWithToggle;
