import React from 'react';
import styles from './PluginMainView.module.css';
import { BackendService } from '../../backend/backend.service';
import { PluginSystem } from '../PluginSystem';
import Button from 'react-bootstrap/Button';

interface PluginMainViewProps {
//  backend: BackendService,
  pluginSystem: PluginSystem,
}
interface PluginMainViewState {
}
class PluginMainView extends React.Component<PluginMainViewProps, PluginMainViewState> {
  constructor(props: PluginMainViewProps) {
    super(props);
  }

  render () {
    return (
      <div className={styles.PluginMainView}>
        <Button onClick={()=> {this.props.pluginSystem.clearFilters()}}>Clear Filters</Button>
      </div>
    );
  }
}
export default PluginMainView;
