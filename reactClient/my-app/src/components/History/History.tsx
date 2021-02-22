import React, { useEffect } from 'react';
import styles from './History.module.css';
import { HistoryItem } from '@pm-server/pm-server-react-client';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { IHistoryProps } from '../commonProps';

const History: React.FC<IHistoryProps> = (props: IHistoryProps) => {
  const columns: Array<IDataTableColumn> = [
    {
      name: 'Timestamp', 
      cell: (row: HistoryItem) => { 
        if (row.time) 
          return ( <span>{row.time.toLocaleString(navigator.language)}</span> ); 
        else 
          return ( <span/> )
      },
      grow: 0
    },
    {name: 'Event', selector: 'event', grow: 1},
    {name: 'Result', selector: 'eventResult', grow: 4},
    {name: 'IP', selector: 'iP', grow: 0},
    {name: 'User-Agent', selector: 'userAgent', grow: 4},
  ];

  const conditionalRowStyles = [{
    when: (event:HistoryItem) =>  !event.eventResult || event.eventResult.toLowerCase().includes("failed") ,
    style: {backgroundColor: 'red'} }];
 
  useEffect(() => {
    props.loadHistoryHandler();
  }, []);

  return (
      <div className={styles.History}>
        <h2>History</h2>
        <DataTable noHeader columns={columns} data={props.historyItems} dense pagination striped conditionalRowStyles={conditionalRowStyles}/>
      </div>
      )
};

export default History;
