import React from 'react';
import styles from './ImportCsv.module.css';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { CsvParser } from './csv/csvParser';
import { CsvConverter } from './csv/csvConverter';
import { FieldOptions } from '../../backend/models/fieldOptions';
import CsvFieldMappingSelect from './CsvFieldMappingSelect/CsvFieldMappingSelect';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

interface ImportCsvProps {
  availableFields: Array<FieldOptions>;
  bulkAddHandler: (newFields: Array<{[index: string]:string}>) => Promise<void>;
  showMessage: (message: string, important?: boolean, clickHandler?: () => void) => void
}
interface ImportCsvState {
  data: Array<{[index: string]:string}>;
  columns: Array<IDataTableColumn<{[index: string]:string}>>;
  headers: Array<string>;
  mapping: Map<string, string | null>;
  waiting: boolean;
}
class ImportCsv extends React.Component<ImportCsvProps, ImportCsvState> {
  parser: CsvParser = new CsvParser();
  importer: CsvConverter = new CsvConverter();

  constructor(props: ImportCsvProps) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      headers: [],
      mapping: new Map<string, string | null>(),
      waiting: false
    }
  }

  fileUploadHandler(event: React.ChangeEvent<HTMLInputElement>) {
    let newFile: File | undefined = undefined;
    if (event.target.files) {
      if (event.target.files.length > 0) {
        newFile = event.target.files[0]
        this.parser = new CsvParser();
        this.importer.availableFields = this.props.availableFields.map((field) => { return field.selector });
        this.props.showMessage("reading file");
        this.createPreview(newFile);
      }
    }
  }
  createPreview(csvFile: File): void {
    this.parser.preview(csvFile)
      .then(() => {
            this.importer.autoHeaderMapping(this.parser.getHeaders());
            this.showInformation();
            this.props.showMessage(`file read, using delimiter '${this.parser.getDelimiter()}'`);
          });
  }
  getColumns(headers: Array<string>, mappings: Map<string, string | null>): Array<IDataTableColumn<{[index: string]:string}>> {
    let columns: Array<IDataTableColumn<{[index: string]:string}>> = []
    for (let head of this.parser.getHeaders()) {
      let name = mappings.get(head);
      if (name !== null) {
        columns.push( { 
          name: name, 
          selector: head
        });
      }
    }
    return columns;
  }

  async importAccounts(): Promise<void> {
    let newAccounts = this.importer.createAccounts(this.state.data);
    await this.props.bulkAddHandler(newAccounts);
      this.props.showMessage(`imported ${newAccounts.length} accounts`);
    this.setState({ data: [] });
  }

  showInformation(): void {
    let headers = this.parser.getHeaders();
    let mapping = this.importer.getHeaderMappings();
    this.setState({
      headers: headers,
      mapping: mapping,
      data: this.parser.getRows(),
      columns: this.getColumns(headers, mapping)
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

  mappingChangeHandler(header: string, newMapping: string) {
    if (newMapping === "") {
      this.importer.setHeaderMapping(header, null);
    }
    else {
      this.importer.setHeaderMapping(header, newMapping);
    }
    let mapping = this.importer.getHeaderMappings()
    let columns = this.getColumns(this.parser.getHeaders(), mapping)
    this.setState({mapping: mapping, columns: columns});
  }

  renderHeaders() {
    return this.state.headers.map((header: string) => (<th key={header}>{header}</th>) );
  }
  renderMapping() {
    return this.state.headers.map((header: string)=> { 
       let mapped = this.state.mapping.get(header);
       let title = header
       if (mapped) {
         title = mapped
       }
       else {
         mapped = ""
       }
         
       return (<td key={header} title={title}><CsvFieldMappingSelect availableFields={this.props.availableFields} mappedFieldSelector={mapped} header={header} changeHandler={this.mappingChangeHandler.bind(this)}/></td>) 
     });
//  <mat-select mat-select [(ngModel)]="selected" (ngModelChange)="onChange($event)">
//    <mat-option value="undefined">undefined</mat-option>
//    <mat-option *ngFor="let field of availableFields" [value]="field">{{field}}</mat-option>
//  </mat-select>
  }
  render () {
    return (
      <div className={styles.ImportCsv}>
        <Col lg={{ span: 2, offset: 5 }} md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
          <h3>Import Accounts</h3>
          <Form>
            <fieldset disabled={this.state.waiting}>
              <Form.Group controlId="importFileUpload">
                <Form.File custom label="Select your file" name="file" onChange={this.fileUploadHandler.bind(this)} accept=".csv" />
              </Form.Group>
            </fieldset>
          </Form>
        </Col>
        <Col>
          <Table bordered>
            <thead><tr><th>CSV Header</th>{this.renderHeaders()}</tr></thead>
            <tbody><tr><td>Mapped Field</td>{this.renderMapping()}</tr></tbody>
          </Table>
          <p><Button onClick={this.importAccounts.bind(this)}>Import</Button></p>
          <DataTable title="Accounts" columns={this.state.columns} data={this.state.data} dense pagination striped />
        </Col>
      </div>
      );
  }
}

export default ImportCsv;
