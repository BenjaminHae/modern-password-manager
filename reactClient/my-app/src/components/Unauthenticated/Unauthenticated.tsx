import React from 'react';
import styles from './Unauthenticated.module.css';
import Login from '../Login/Login';
import WebAuthnLocal from '../WebAuthnLocal/WebAuthnLocal.lazy';
import Register from '../Register/Register';
import { IMessageOptions } from '../../libs/MessageManager';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

interface UnauthenticatedProps {
  doLogin: (username: string, password: string) => void;
  doRegister: (username: string, password: string, email: string) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
  showRegistration: boolean;
  showPersistedLogons?: boolean;
  ready: boolean;
  autoLogin: () => Promise<void>;
  doingAutoLogin: boolean;
}
class Unauthenticated extends React.Component<UnauthenticatedProps> {
  render (): JSX.Element {
    return (
      <div className={styles.Unauthenticated}>
        <Col xl={{ span: 4, offset: 4 }} lg={{ span: 6, offset: 3 }} md={{ span: 6, offset: 3 }} sm={{ span: 10, offset: 1 }}>
          { this.props.doingAutoLogin  &&
            <div className={ styles.Waiting }><Spinner animation="border" role="status"/><p>Auto Login is in progress</p></div>
          }
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="light" eventKey="0" className="text-left">
                  <h2>Login</h2>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Col xl={{ span: 10, offset: 1 }} lg={{ span: 12, offset: 0 }}>
                    <Login doLogin={this.props.doLogin} ready={this.props.ready} />
                  </Col>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            {this.props.showPersistedLogons &&
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="light" eventKey="2" className="text-left">
                  <h2>Logon without password</h2>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="2"> 
                <Card.Body>
                  <WebAuthnLocal ready={this.props.ready} autoLogin={this.props.autoLogin}/>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            }
            {this.props.showRegistration && 
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="light" eventKey="1" className="text-left">
                  <h2>Registration</h2>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1"> 
                <Card.Body>
                  <Col xl={{ span: 10, offset: 1 }} lg={{ span: 12, offset: 0 }}>
                    <Register 
                      doRegister={this.props.doRegister} 
                      showMessage={this.props.showMessage}
                    />
                  </Col>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            }
          </Accordion>
        </Col>
      </div>
    )
  }
}

export default Unauthenticated;
