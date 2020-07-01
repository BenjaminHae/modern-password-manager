import React from 'react';
import styles from './TagViewComponent.module.css';

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
    let newSelectedTags = this.state.selectedTags.concat(tag)
    this.setState({selectedTags: newSelectedTags});
    this.props.filterCallback(newSelectedTags);
  }
  printTags() {
    return this.props.tags.map((tag: string) => (<button key={tag} onClick={()=>this.selectTag(tag)}>{tag}</button> ) );
  }
  render() {
    return (
        <div className={styles.TagViewComponent}>
          <h3>Tags</h3>
          {this.printTags()}
        </div>
        );
  }
}

export default TagViewComponent;
