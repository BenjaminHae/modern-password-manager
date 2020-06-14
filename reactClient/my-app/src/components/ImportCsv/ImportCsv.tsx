import React from 'react';
import styles from './ImportCsv.module.css';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { CsvParser } from './csv/csvParser';
import { CsvConverter } from './csv/csvConverter';
import { FieldOptions } from '../../backend/models/fieldOptions';
import CsvFieldMappingSelect from './CsvFieldMappingSelect/CsvFieldMappingSelect';

interface ImportCsvProps {
  availableFields: Array<FieldOptions>;
}
interface ImportCsvState {
  data: Array<{[index: string]:string}>;
  columns: Array<IDataTableColumn<{[index: string]:string}>>;
  message: string;
  headers: Array<string>;
  mapping: Map<string, string | null>;
}
class ImportCsv extends React.Component<ImportCsvProps, ImportCsvState> {
  parser: CsvParser = new CsvParser();
  importer: CsvConverter = new CsvConverter();

  constructor(props: ImportCsvProps) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      message: "",
      headers: [],
      mapping: new Map<string, string | null>()
    }
  }

  fileUploadHandler(event: React.ChangeEvent<HTMLInputElement>) {
    let newFile: File | undefined = undefined;
    if (event.target.files) {
      if (event.target.files.length > 0) {
        newFile = event.target.files[0]
        this.parser = new CsvParser();
        this.importer.availableFields = this.props.availableFields.map((field) => { return field.selector });
        this.setState({message : "reading file"});
        this.createPreview(newFile);
      }
    }
  }
  createPreview(csvFile: File): void {
    this.parser.preview(csvFile)
      .then(() => {
            this.importer.autoHeaderMapping(this.parser.getHeaders());
            this.showInformation();
            this.setState({message : "file read, using delimiter '" + this.parser.getDelimiter() + "'"});
          });
  }

  showInformation(): void {
    this.setState({
      headers: this.parser.getHeaders(),
      mapping: this.importer.getHeaderMappings()
    });
    //this.headersSelector = this.headers.map(s => s+"_selector");
  }
  getColumnNameBySelector(selector: string) {
    for (let item of this.props.availableFields) {
      if (item.selector === selector) {
        return item.name;
      }
    }
    return selector;
  }
  renderHeaders() {
    return this.state.headers.map((header: string) => (<td key={header}>{header}</td>) );
  }
  renderMapping() {
    return this.state.headers.map((header: string)=> { 
       let mapped = this.state.mapping.get(header);
       if (mapped == null) {
         mapped = header;
       }
         
       return (<td key={header} title={mapped}><CsvFieldMappingSelect availableFields={this.props.availableFields} mappedFieldSelector={mapped} header={header} changeHandler={this.mappingChangeHandler.bind(this)}/></td>) 
     });
//  <mat-select mat-select [(ngModel)]="selected" (ngModelChange)="onChange($event)">
//    <mat-option value="undefined">undefined</mat-option>
//    <mat-option *ngFor="let field of availableFields" [value]="field">{{field}}</mat-option>
//  </mat-select>
  }
  render () {
    return (
      <div className={styles.ImportCsv}>
        <h3>Import Accounts</h3>
              <form method="post" action="#" id="#">
                  <div>
                    <label>Upload Your File </label>
                    <input type="file" onChange={this.fileUploadHandler.bind(this)} accept=".csv"/>
                  </div>
              </form>
        <div>
        <table>
          <thead><tr>{this.renderHeaders()}</tr></thead>
          <tbody><tr>{this.renderMapping()}</tr></tbody>
        </table>
	<DataTable title="Accounts" columns={this.state.columns} data={this.state.data} />
        </div>
        
      </div>
      );
  }

  mappingChangeHandler(header: string, newMapping: string) {
  }
}

export default ImportCsv;
