import React from 'react';
import styles from './PluginMainView.module.css';
import { BackendService } from '../../backend/backend.service';

interface PluginMainViewProps {
  backend: BackendService;
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
      </div>
    );
  }
}
export default PluginMainView;
