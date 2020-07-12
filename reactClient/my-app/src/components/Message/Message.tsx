import React from 'react';
import styles from './Message.module.css';
import Alert from 'react-bootstrap/Alert';

export interface IMessageProps {
  important: boolean;
  message: string;
  closeHandler?: (() => void);
  show: boolean;
}

const Message: React.FC<IMessageProps> = (props: IMessageProps) => {
  return (
    <Alert show={props.show} dismissible variant={ props.important ? "danger" : "primary" } onClose={props.closeHandler} >
      { props.message }
    </Alert>
  );
}

export default Message;
