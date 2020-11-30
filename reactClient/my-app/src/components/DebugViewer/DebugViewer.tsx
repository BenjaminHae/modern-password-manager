import React from 'react';
import styles from './DebugViewer.module.css';

interface IDebugProps {
  messages: Array<string>;
  counter: number;
}
const DebugViewer: React.FC<IDebugProps> = (props: IDebugProps) => {
  const items = props.messages.slice(0, props.messages.length).map((message: string, idx: number) => (
    <p key= {idx}>{message}</p>
    ));
  return (
    <div className={styles.DebugViewer}>
      <pre>{props.messages.slice(0, props.messages.length).join("\r\n")}</pre>
    </div>
  );
}

export default DebugViewer;
