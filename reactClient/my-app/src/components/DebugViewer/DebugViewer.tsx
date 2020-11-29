import React from 'react';
import styles from './DebugViewer.module.css';

interface IDebugProps {
  messages: Array<string>;
}
const DebugViewer: React.FC<IDebugProps> = (props: IDebugProps) => {
  const items = props.messages.slice(Math.max(props.messages.length - 10, 0)).map((message: string, idx: number) => (
    <p key= {idx}>{message}</p>
    ));
  return (
    <div className={styles.DebugViewer}>
      {items}
    </div>
  );
}

export default DebugViewer;
