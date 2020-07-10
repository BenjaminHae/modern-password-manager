import React from 'react';
import styles from './History.module.css';
import { HistoryItem } from '@pm-server/pm-server-react-client';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';

interface IHistoryProps {
  historyItems: Array<HistoryItem>
}
const History: React.FC<IHistoryProps> = (props: IHistoryProps) => {
  const columns: Array<IDataTableColumn<HistoryItem>> = [
    {
      name: 'Timestamp', 
      cell: (row: HistoryItem) => { 
        if (row.time) 
          return ( <span>{row.time.toString()}</span> ); 
        else 
          return ( <span/> )
      }
    },
    {name: 'Event', selector: 'event'},
    {name: 'Result', selector: 'eventResult'},
    {name: 'IP', selector: 'iP'},
    {name: 'User-Agent', selector: 'userAgent'},
  ];

  return (
      <div className={styles.History}>
      History Component
        <DataTable title="History" columns={columns} data={props.historyItems} />
      </div>
      )
};

export default History;
