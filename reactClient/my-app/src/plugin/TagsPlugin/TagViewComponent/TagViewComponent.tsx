import React from 'react';
import styles from './TagViewComponent.module.css';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

interface TagViewProps {
  tags: Array<string>;
  filterCallback: (tags: Array<string>) => void;
}
interface TagViewState {
  selectedTags: Array<string>;
}
class TagViewComponent extends React.Component<TagViewProps, TagViewState> {
  constructor (props: TagViewProps) {
    super(props);
    this.state = {selectedTags: []};
  }
  clearSelected() {
    this.setState({selectedTags: []});
  }
  selectTag(tag: string) {
    let newSelectedTags = this.state.selectedTags
    if (newSelectedTags.includes(tag)) {
      newSelectedTags = newSelectedTags.filter(t => t !== tag);
    }
    else {
      newSelectedTags = newSelectedTags.concat(tag);
    }
    this.setState({selectedTags: newSelectedTags});
    this.props.filterCallback(newSelectedTags);
  }
  printTags() {
    return this.props.tags.map(
      (tag: string) => 
        ( <Button key={tag} size="sm" variant={this.state.selectedTags.includes(tag) ? "info" : "outline-info"} onClick={()=>this.selectTag(tag)}>{tag}</Button> )
    );
  }
  render() {
    return (
        <Col className={styles.TagViewComponent} lg={3} xl={3} sm={6} xs={12}>
          <h3>Tags</h3>
          {this.printTags()}
        </Col>
        );
  }
}

export default TagViewComponent;
