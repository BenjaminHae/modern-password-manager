import React from 'react';
import styles from './Message.module.css';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { IMessage } from '../../libs/MessageManager';

export interface IMessageProps {
  messages: Array<IMessage>;
  closeHandler: ((message: IMessage) => void);
}

const Message: React.FC<IMessageProps> = (props: IMessageProps) => {
  function getMessages(props: IMessageProps) {
    return props.messages.map( (message: IMessage) => 
        <Alert 
          key={message.id} 
          dismissible 
          variant={ message.variant === undefined ? "info" : message.variant } 
          onClose={()=>props.closeHandler(message)} 
          transition={Collapse} 
          show={message.show} 
        >
        { message.message }
        { message.button && 
          <Button 
            variant={ message.button.variant } 
            onClick={ () => { 
                if (message.button)
                  message.button.handler(); 
                props.closeHandler(message); 
              } 
            } 
            size="sm"
            className="float-right"
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
