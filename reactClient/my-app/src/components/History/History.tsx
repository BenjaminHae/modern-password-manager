import React, { useEffect } from 'react';
import styles from './History.module.css';
import { HistoryItem } from '@pm-server/pm-server-react-client';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';

export interface IHistoryProps {
  historyItems: Array<HistoryItem>;
  loadHistoryHandler: () => Promise<void>;
}
const History: React.FC<IHistoryProps> = (props: IHistoryProps) => {
  const columns: Array<IDataTableColumn> = [
    {
      name: 'Timestamp', 
      cell: (row: HistoryItem) => { 
        if (row.time) 
          return ( <span>{row.time.toLocaleString(navigator.language)}</span> ); 
        else 
          return ( <span/> )
      }
    },
    {name: 'Event', selector: 'event'},
    {name: 'Result', selector: 'eventResult'},
    {name: 'IP', selector: 'iP'},
    {name: 'User-Agent', selector: 'userAgent'},
  ];

  const conditionalRowStyles = [{
    when: (event:HistoryItem) =>  !event.eventResult || event.eventResult.toLowerCase().includes("failed") ,
    style: {backgroundColor: 'red'} }];
 
  useEffect(() => {
    if (props.historyItems.length === 0) {
      props.loadHistoryHandler();
    }
  });

  return (
      <div className={styles.History}>
        <h3>History</h3>
        <DataTable noHeader columns={columns} data={props.historyItems} dense pagination striped conditionalRowStyles={conditionalRowStyles}/>
      </div>
      )
};

export default History;
