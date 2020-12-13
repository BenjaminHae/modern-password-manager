import React from 'react';
import styles from './ImportCsv.module.css';
import DataTable from 'react-data-table-component';
import { IDataTableColumn } from 'react-data-table-component';
import { CsvParser } from './csv/csvParser';
import { CsvConverter } from './csv/csvConverter';
import { FieldOptions } from '../../backend/models/fieldOptions';
import { IMessageOptions } from '../Message/Message';
import CsvFieldMappingSelect from './CsvFieldMappingSelect/CsvFieldMappingSelect';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

interface ImportCsvProps {
  availableFields: Array<FieldOptions>;
  bulkAddHandler: (newFields: Array<{[index: string]:string}>) => Promise<void>;
  showMessage: (message: string, options?: IMessageOptions) => void;
}
interface ImportCsvState {
  data: Array<{[index: string]:string}>;
  columns: Array<IDataTableColumn>;
  headers: Array<string>;
  mapping: Map<string, string | null>;
  waiting: boolean;
  showPasswords: boolean;
  file?: File;
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
      waiting: false,
      showPasswords: false
    }
  }

  fileUploadHandler(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      if (event.target.files.length > 0) {
        const newFile = event.target.files[0]
        this.setState({file: newFile});
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
  getColumns(headers: Array<string>, mappings: Map<string, string | null>): Array<IDataTableColumn> {
    const columns: Array<IDataTableColumn> = []
    for (const head of this.parser.getHeaders()) {
      const name = mappings.get(head);
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
    this.setState({waiting: true});
    if (!this.state.file) {
      this.props.showMessage(`no file loaded`, {variant: "warning", autoClose: true});
      return;
    }
    try {
      await this.parser.parseFile(this.state.file);
      const newAccounts = this.importer.createAccounts(this.parser.getRows());
      await this.props.bulkAddHandler(newAccounts);
      this.props.showMessage(`imported ${newAccounts.length} accounts`);
      this.setState({ file: undefined, data: [], waiting: false});
    }
    catch(e) {
      this.props.showMessage(`There was an error when importing: ${e.toString()}`, {variant: "warning", autoClose: false});
    }
  }

  showInformation(): void {
    const headers = this.parser.getHeaders();
    const mapping = this.importer.getHeaderMappings();
    this.setState({
      headers: headers,
      mapping: mapping,
      data: this.parser.getRows(),
      columns: this.getColumns(headers, mapping)
    });
    //this.headersSelector = this.headers.map(s => s+"_selector");
  }

  getColumnNameBySelector(selector: string): string {
    for (const item of this.props.availableFields) {
      if (item.selector === selector) {
        return item.name;
      }
    }
    return selector;
  }

  mappingChangeHandler(header: string, newMapping: string): void {
    if (newMapping === "") {
      this.importer.setHeaderMapping(header, null);
    }
    else {
      this.importer.setHeaderMapping(header, newMapping);
    }
    const mapping = this.importer.getHeaderMappings()
    const columns = this.getColumns(this.parser.getHeaders(), mapping)
    this.setState({mapping: mapping, columns: columns});
  }

  renderHeaders(): Array<JSX.Element> {
    return this.state.headers.map((header: string) => (<th key={header}>{header}</th>) );
  }
  renderMapping(): Array<JSX.Element> {
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
  render (): JSX.Element{
    return (
      <div className={styles.ImportCsv}>
        <Form>
        <Col lg={{ span: 2, offset: 5 }} md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
          <h3>Import Accounts</h3>
            <fieldset disabled={this.state.waiting}>
              <Form.Group controlId="importFileUpload">
                <Form.File custom label="Select your file" name="file" onChange={this.fileUploadHandler.bind(this)} accept=".csv" />
              </Form.Group>
            </fieldset>
        </Col>
        { this.state.data.length > 0 &&
          <Col>
            <h3>Map CSV columns to account properties</h3>
            <Table bordered>
              <thead><tr><th>CSV Header</th>{this.renderHeaders()}</tr></thead>
              <tbody><tr><th>Mapped Field</th>{this.renderMapping()}</tr></tbody>
            </Table>
            <p><Button onClick={this.importAccounts.bind(this)}>Import</Button></p>
            <h3>Accounts to import</h3>
            <p><Form.Check type='checkbox' label="Show Passwords" onChange={ ()=>this.setState({showPasswords: ! this.state.showPasswords})} /></p>
            <DataTable noHeader columns={this.state.columns.filter((col)=>{ return !(!this.state.showPasswords && col.name==="password")} )} 
              data={ this.state.data.map((acc) => {
                if (this.state.showPasswords)
                  return acc;
                const { password, ...cleanAcc } = acc;
                return cleanAcc;
            })} dense pagination striped />
          </Col>
        }
        </Form>
      </div>
      );
  }
}

export default ImportCsv;
