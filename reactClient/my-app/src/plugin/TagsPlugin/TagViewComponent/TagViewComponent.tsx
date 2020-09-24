import React from 'react';
import styles from './TagViewComponent.module.css';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

interface TagViewProps {
  tags: Array<string>;
  filterCallback: (tags: Array<string>) => void;
}
interface TagViewState {
  selectedTags: Array<string>;
  show: boolean;
}
class TagViewComponent extends React.Component<TagViewProps, TagViewState> {
  constructor (props: TagViewProps) {
    super(props);
    this.state = {selectedTags: [], show: false};
  }
  clearSelected(): void {
    this.setState({selectedTags: []});
  }
  selectTag(tag: string): void {
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
  printTags(): Array<JSX.Element> {
    return this.props.tags.map(
      (tag: string) => 
        ( <Button key={tag} className="btn-xs" variant={this.state.selectedTags.includes(tag) ? "info" : "outline-info"} onClick={()=>this.selectTag(tag)}>{tag}</Button> )
    );
  }
  render(): JSX.Element {
    return (
        <Col className={styles.TagViewComponent} xl={4} lg={4} sm={12} xs={12}>
          <h3>Tags <Button size="sm" className="d-lg-none" onClick={()=>this.setState({show: !this.state.show})}>{this.state.show ? "Hide" : "Show"}</Button> </h3>
          <Container className={this.state.show ? "" : "d-none d-lg-block"} >
            {this.printTags()}
          </Container>
        </Col>
        );
  }
}

export default TagViewComponent;
