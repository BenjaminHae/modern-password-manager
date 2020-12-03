import React from 'react';
import styles from './DebugViewer.module.css';

interface IDebugProps {
  messages: Array<string>;
  counter: number;
}
const DebugViewer: React.FC<IDebugProps> = (props: IDebugProps) => {
  return (
    <div className={styles.DebugViewer}>
      <span>Showing { props.counter * 10 } debug messages</span>
      <pre>{props.messages.slice(0, props.messages.length).join("\r\n")}</pre>
    </div>
  );
}

export default DebugViewer;
