import React from 'react';
import styles from './UserConfiguration.module.css';
import { UserOptions } from '../../backend/models/UserOptions';

interface UserConfigurationProps {
  options: UserOptions;
}
const UserConfiguration: React.FC<UserConfigurationProps> = (props: UserConfigurationProps) => (
  <div className={styles.UserConfiguration}>
    <h3>User Options</h3>
    <pre>
    { JSON.stringify(props.options) }
    </pre>
  </div>
);

export default UserConfiguration;
