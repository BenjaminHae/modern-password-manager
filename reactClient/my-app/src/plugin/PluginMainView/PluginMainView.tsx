import React from 'react';
import styles from './PluginMainView.module.css';
//import { BackendService } from '../../backend/backend.service';
import { PluginSystem } from '../PluginSystem';
import Button from 'react-bootstrap/Button';

interface PluginMainViewProps {
//  backend: BackendService,
  pluginSystem: PluginSystem;
}
interface PluginMainViewState {
}
class PluginMainView extends React.Component<PluginMainViewProps, PluginMainViewState> {
  render () {
    return (
      <div className={styles.PluginMainView}>
        { this.props.pluginSystem.getMainView() }
        { this.props.pluginSystem.filterPresent && <Button onClick={()=> {this.props.pluginSystem.clearFilters()}}>Clear Filters</Button> }
      </div>
    );
  }
}
export default PluginMainView;
