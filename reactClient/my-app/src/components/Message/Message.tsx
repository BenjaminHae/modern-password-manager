import React from 'react';
import styles from './Message.module.css';
import Alert from 'react-bootstrap/Alert';

export interface IMessageProps {
  message: string;
  options: IMessageOptions;
  closeHandler?: (() => void);
  show: boolean;
}

export interface IMessageOptions {
  autoClose?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  messageClickHandler?: (()=>void);
}

const Message: React.FC<IMessageProps> = (props: IMessageProps) => {
  return (
    <Alert show={props.show} dismissible variant={ props.options.variant === undefined ? "info" : props.options.variant } onClose={props.closeHandler} >
      { props.message }
    </Alert>
  );
}

export default Message;
