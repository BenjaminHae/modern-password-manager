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
        (<button key={tag} className={this.state.selectedTags.includes(tag) ? styles.selectedTag : ""} onClick={()=>this.selectTag(tag)}>{tag}</button> )
    );
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
