import React from 'react';
import styles from './PluginMainView.module.css';
//import { BackendService } from '../../backend/backend.service';
import { PluginSystem } from '../PluginSystem';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

interface PluginMainViewProps {
//  backend: BackendService,
  pluginSystem: PluginSystem;
}
interface PluginMainViewState {
}
class PluginMainView extends React.Component<PluginMainViewProps, PluginMainViewState> {
  render () {
    return (
      <Container className={styles.PluginMainView}>
        <Row>
          { this.props.pluginSystem.getMainView() }
        </Row>
        <Row>
          { this.props.pluginSystem.filterPresent && <Button className={styles.ResetFilter} onClick={()=> {this.props.pluginSystem.clearFilters()}}>Clear Filters</Button> }
        </Row>
      </Container>
    );
  }
}
export default PluginMainView;
