import React from 'react';
import { FieldOptions } from '../../../backend/models/fieldOptions';
import styles from './CsvFieldMappingSelect.module.css';
import Form from 'react-bootstrap/Form';

interface CsvFieldMappingSelectProps {
  availableFields: Array<FieldOptions>;
  mappedFieldSelector: string;
  header: string;
  changeHandler: (header: string, newMapping: string) => void;
}
interface OptionInfo {
  name: string;
  selector: string;
}
class CsvFieldMappingSelect extends React.Component<CsvFieldMappingSelectProps> {

  getOptions(): Array<JSX.Element> {
    const options: Array<OptionInfo> = [
      { name: "", selector: ""},
      { name: "Password", selector: "password"},
      { name: "Name", selector: "name"}
      ]
    for (const field of this.props.availableFields) {
      options.push({ name: field.name, selector: field.selector})
    }

    return options.map((field) => (<option value={field.selector} key={field.selector} >{field.name}</option>));
  }

  handleSelect(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.props.changeHandler(this.props.header, event.target.value);
    event.preventDefault();
  }

  render (): JSX.Element {
    return (
      <Form.Group>
        <Form.Control as="select" className={styles.CsvFieldMappingSelect} value={this.props.mappedFieldSelector} onChange={this.handleSelect.bind(this)} >
      {this.getOptions()}
        </Form.Control>
      </Form.Group>
    );
  }
}

export default CsvFieldMappingSelect;
