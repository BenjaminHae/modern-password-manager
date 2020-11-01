import React from 'react';
import { IMessageOptions } from '../Message/Message';
import styles from './UserSettings.module.css';
import UserFieldConfiguration, {IUserFieldConfigurationProps} from '../UserFieldConfiguration/UserFieldConfiguration';
import ChangePassword, {IChangePasswordProps} from '../ChangePassword/ChangePassword';
import WebAuthn, {IWebAuthnProps} from '../WebAuthn/WebAuthn';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

export interface IUserSettingsProps extends IWebAuthnProps, IChangePasswordProps, IUserFieldConfigurationProps{
  showMessage: (message: string, options?: IMessageOptions) => void;
}
const UserSettings: React.FC<IUserSettingsProps> = (props: IUserSettingsProps) => {
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  return (
    <div className={styles.UserSettings}>
      <Col lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} sm={{ span: 12 }}>
        <h2>Settings</h2>
        <UserFieldConfiguration 
          {...props}
        />
        <Col lg={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
          <h3><Button onClick={()=>setShowChangePassword(!showChangePassword)} >Change Password </Button></h3>
          <ChangePassword 
            {...props}
          />
        </Col>
        <WebAuthn
          {...props}
        />
      </Col>
    </div>
    );
}

export default UserSettings;
