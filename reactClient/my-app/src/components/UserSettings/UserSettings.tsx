import React from 'react';
import { UserOptions } from '../../backend/models/UserOptions';
import { IMessageOptions } from '../Message/Message';
import styles from './UserSettings.module.css';
import UserFieldConfiguration from '../UserFieldConfiguration/UserFieldConfiguration';
import ChangePassword from '../ChangePassword/ChangePassword';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

interface UserSettingsProps {
  options: UserOptions;
  showMessage: (message: string, options?: IMessageOptions) => void;
  doStoreOptions: (options: UserOptions) => Promise<void>;
  changePasswordHandler: (oldPassword: string, newPassword: string) => Promise<void>;
}
const UserSettings: React.FC<UserSettingsProps> = (props: UserSettingsProps) => {
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  return (
    <div className={styles.UserSettings}>
      <Col lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} sm={{ span: 12 }}>
        <h2>Settings</h2>
        <UserFieldConfiguration 
          options={props.options}
          showMessage={props.showMessage}
          doStoreOptions={props.doStoreOptions}
        />
        <Col lg={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
          <h3><Button onClick={()=>setShowChangePassword(!showChangePassword)} >Change Password </Button></h3>
          <ChangePassword 
            changePasswordHandler={props.changePasswordHandler} 
            showMessage={props.showMessage}
          />
        </Col>
      </Col>
    </div>
    );
}

export default UserSettings;
