import React from 'react';
import styles from './Unauthenticated.module.css';
import Login from '../Login/Login';
import Register from '../Register/Register';
import { IMessageOptions } from '../Message/Message';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

interface UnauthenticatedProps {
  doLogin: (username: string, password: string) => void;
  doRegister: (username: string, password: string, email: string) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
  showRegistration: boolean;
  showPersistedLogons?: boolean;
  ready: boolean;
}
class Unauthenticated extends React.Component<UnauthenticatedProps> {
  constructor(props: UnauthenticatedProps) {
    super(props);
  }
  render (): JSX.Element {
    return (
      <div className={styles.Unauthenticated}>
        <Col xl={{ span: 2, offset: 5 }} lg={{ span: 4, offset: 4 }} md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="light" eventKey="0">
                  <h2>Login</h2>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Login doLogin={this.props.doLogin} ready={this.props.ready}/>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            {this.props.showRegistration && 
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="light" eventKey="1">
                  <h2>Registration</h2>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1"> 
                <Card.Body>
                  <Register 
                    doRegister={this.props.doRegister} 
                    showMessage={this.props.showMessage}
                  />
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
