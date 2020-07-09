import React from 'react';
import styles from './Message.module.css';

export interface IMessageProps {
  message: string;
  important: boolean;
  clickHandler?: (() => void);
}

const Message: React.FC<IMessageProps> = (props: IMessageProps) => (
  <div className={styles.Message} onClick={()=> {if (props.clickHandler) props.clickHandler()}}>
    { props.message }
  </div>
);

export default Message;
