import React from 'react';
import styles from './HistoryDetail.module.css';
import { HistoryItem } from '@pm-server/pm-server-react-client';

interface IHistoryDetailProps {
  data?: HistoryItem;
}
const DetailRow = (header: string, value: string) => (
  <tr>
    <th>
      { header }
    </th>
    <td>
      { value }
    </td>
  </tr>
);
const HistoryDetail: React.FC<IHistoryDetailProps> = (props: IHistoryDetailProps) => (
  <div className={styles.HistoryDetail}>
    { props.data ?
      <table>
        { DetailRow('Timestamp', props.data.time ? props.data.time.toLocaleString(navigator.language) : '') }
        { DetailRow('Event', props.data.event) }
        { DetailRow('Result', props.data.eventResult) }
        { DetailRow('IP', props.data.iP) }
        { DetailRow('User-Agent', props.data.userAgent) }
      </table>
      :
      <span> no data present </span>
    }
  </div>
);

export default HistoryDetail;
