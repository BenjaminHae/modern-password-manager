import React from 'react';
import styles from './PluginMainView.module.css';
//import { BackendService } from '../../backend/backend.service';
import { PluginSystem } from '../PluginSystem';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

interface PluginMainViewProps {
//  backend: BackendService,
  pluginSystem: PluginSystem;
}
class PluginMainView extends React.Component<PluginMainViewProps> {
  render (): JSX.Element {
    return (
      <Container className={styles.PluginMainView}>
        <Row className="container">
          { this.props.pluginSystem.getMainView() }
          <Col className={styles.ResetFilterCol} xl={2} lg={2} sm={3} xs={12}>
            { this.props.pluginSystem.filterPresent && <Button className={styles.ResetFilter} onClick={()=> {this.props.pluginSystem.clearFilters()}} size="sm" >Clear Filters</Button> }
          </Col>
        </Row>
      </Container>
    );
  }
}
export default PluginMainView;
