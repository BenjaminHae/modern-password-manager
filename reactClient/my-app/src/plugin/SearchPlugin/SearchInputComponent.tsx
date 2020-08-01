import React from 'react';
import styles from './SearchInputComponent.module.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Search } from 'react-bootstrap-icons';

interface SearchInputProps {
  filterCallback: (expression: string) => void;
}
interface SearchInputState {
  expression: string;
}
class SearchInputComponent extends React.Component<SearchInputProps, SearchInputState> {
  constructor (props: SearchInputProps) {
    super(props);
    this.state = {expression: ""};
  }
  clearInput() {
    this.setState({expression: ""});
  }
  handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({expression: event.target.value});
    this.props.filterCallback(event.target.value);
  }
  render() {
    return (
        <div>
          <Form.Group>
            <Form.Label srOnly={true}>Search</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text><Search/></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control size="sm" type="text" placeholder="Search" name="searchValue" onChange={this.handleSearchChange.bind(this)} value={this.state.expression} />
            </InputGroup>
          </Form.Group>
        </div>
        );
  }
}

export default SearchInputComponent;
