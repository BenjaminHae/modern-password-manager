import React from 'react';
import styles from './UserSettings.module.css';
import UserFieldConfiguration from '../UserFieldConfiguration/UserFieldConfiguration';
import ChangePassword from '../ChangePassword/ChangePassword';
import WebAuthn from '../WebAuthn/WebAuthn';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { IUserSettingsProps } from '../commonProps';

const UserSettings: React.FC<IUserSettingsProps> = (props: IUserSettingsProps) => {
  return (
      <Col lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }} sm={{ span: 12 }} className={styles.UserSettings}>
        <h2>Settings</h2>
          <Accordion>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="light" eventKey="0">
                  <h4>User Field Options</h4>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <UserFieldConfiguration 
                    {...props}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="light" eventKey="1">
                  <h4>Change Password</h4>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                  <Col lg={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
                    <Card.Body>
                      <ChangePassword 
                        {...props}
                      />
                    </Card.Body>
                  </Col>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="light" eventKey="2">
                  <h4>Logon without password</h4>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <WebAuthn
                    {...props}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
        </Accordion>
      </Col>
    );
}

export default UserSettings;
