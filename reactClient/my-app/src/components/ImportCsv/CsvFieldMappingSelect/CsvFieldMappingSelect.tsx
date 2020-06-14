import React from 'react';
import { FieldOptions } from '../../../backend/models/fieldOptions';
import styles from './CsvFieldMappingSelect.module.css';

interface CsvFieldMappingSelectProps {
  availableFields: Array<FieldOptions>;
  mappedFieldSelector: string;
  header: string;
  changeHandler: (header: string, newMapping: string) => void;
}
interface CsvFieldMappingSelectState {
}
interface OptionInfo {
  name: string;
  selector: string;
}
class CsvFieldMappingSelect extends React.Component<CsvFieldMappingSelectProps, CsvFieldMappingSelectState> {

  getOptions() {
    let options: Array<OptionInfo> = [
      { name: "", selector: ""},
      { name: "Password", selector: "password"}
      ]
    for (let field of this.props.availableFields) {
      options.push({ name: field.name, selector: field.selector})
    }

    return options.map((field) => (<option value={field.selector} key={field.selector} >{field.name}</option>));
  }

  render () {
    return (
      <select className={styles.CsvFieldMappingSelect} value={this.props.mappedFieldSelector} >
      {this.getOptions()}
      </select>
    );
  }
}

export default CsvFieldMappingSelect;
