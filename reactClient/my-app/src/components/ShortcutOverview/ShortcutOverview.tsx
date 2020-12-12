import React from 'react';
import styles from './ShortcutOverview.module.css';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import ShortcutManager from '../../libs/ShortcutManager';

export interface ShortcutOverviewProps {
  show: boolean;
  hide: () => void;
  shortcuts: ShortcutManager;
}
const ShortcutOverview: React.FC<ShortcutOverviewProps> = (props: ShortcutOverviewProps) => {
  const items = props.shortcuts.getAllShortcuts().map((entry, index) => (
    <tr key={index}>
      <td className={styles.ShortcutCell}>
        { entry.shortcut instanceof Array ?
        <>{entry.shortcut.map<React.ReactNode>((sc, index) => ( <Badge pill variant="secondary" key={index}> {sc} </Badge>)).reduce((prev, curr) => [prev, ', ', curr])}</> :
        <><Badge pill variant="secondary">{ entry.shortcut }</Badge></>}
      </td>
      <td>{entry.description}</td>
    </tr>
    ));
  return (
    <Modal show={props.show} onHide={props.hide} >
      <Modal.Header closeButton>
        <Modal.Title>Shortcuts</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <table>
            <tbody>
              {items}
            </tbody>
          </table>
        </Modal.Body>
    </Modal>
    );
}

export default ShortcutOverview;
