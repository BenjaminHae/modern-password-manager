import React, {createRef} from 'react';
import styles from './SearchInputComponent.module.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { Search } from 'react-bootstrap-icons';
import ShortcutManager, { ShortcutEntry } from '../../libs/ShortcutManager';
import { ExtendedKeyboardEvent }from 'mousetrap';

interface SearchInputProps {
  filterCallback: (expression: string) => void;
  shortcuts: ShortcutManager;
}
interface SearchInputState {
  expression: string;
}
class SearchInputComponent extends React.Component<SearchInputProps, SearchInputState> {
  private inputRef = createRef<HTMLInputElement>();
  constructor (props: SearchInputProps) {
    super(props);
    this.state = {expression: ""};
  }
  componentDidMount(): void {
    const focus = (e: ExtendedKeyboardEvent) => { 
      if (this.inputRef.current) {
        e.preventDefault();
        this.inputRef.current.focus();
      }
    }
    this.props.shortcuts.addShortcut({ shortcut: "/", action: focus, description: "Focus find input", component: this} );
  }
  componentWillUnmount(): void {
    this.props.shortcuts.removeByComponent(this);
  }
  clearInput(): void {
    this.setState({expression: ""});
  }
  handleSearchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({expression: event.target.value});
    this.props.filterCallback(event.target.value);
  }
  render(): JSX.Element {
    return (
        <Col className={styles.SearchInputComponent} lg={3} xl={3} sm={6} xs={12}>
          <Form.Group className={styles.SearchInput}>
            <Form.Label srOnly={true}>Search</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text><Search/></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control ref={this.inputRef} size="sm" type="text" placeholder="Search" name="searchValue" onChange={this.handleSearchChange.bind(this)} value={this.state.expression} />
            </InputGroup>
          </Form.Group>
        </Col>
        );
  }
}

export default SearchInputComponent;
