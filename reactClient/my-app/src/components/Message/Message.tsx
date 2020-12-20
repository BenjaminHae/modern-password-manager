import React from 'react';
import styles from './Message.module.css';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

export interface IMessageProps {
  messages: Array<IMessage>;
  closeHandler: ((id: number) => void);
}

export interface IMessageOptions {
  autoClose?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  button?: IMessageButton;
}
export interface IMessageButton {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  handler: (()=>void);
  text: string;
}

export interface IMessage extends IMessageOptions {
  id: number;
  message: string;
  show: boolean;
}

const Message: React.FC<IMessageProps> = (props: IMessageProps) => {
  function getMessages(props: IMessageProps) {
    return props.messages.map( (message: IMessage) => 
        <Alert 
          key={message.id} 
          dismissible 
          variant={ message.variant === undefined ? "info" : message.variant } 
          onClose={()=>props.closeHandler(message.id)} 
          transition={Collapse as any} 
          show={message.show} 
        >
        { message.message }
        { message.button && 
          <Button 
            variant={ message.button.variant } 
            onClick={ () => { 
                if (message.button)
                  message.button.handler(); 
                props.closeHandler(message.id); 
              } 
            } 
            size="sm"
          > 
            { message.button.text } 
          </Button>
        }
        </Alert>
        );
  }
  return <div className={ styles.Message }> { getMessages(props) } </div>
}

export default Message;
