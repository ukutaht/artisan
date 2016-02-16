import React from 'react'
import ReactDOM from 'react-dom'
import Sortable from 'sortablejs'

import StoryCard from './story-card'

var _nextSibling;
var _draggedFrom;
var _draggingStory;

const columnTitles = {
  backlog: "Backlog",
  ready: "Ready",
  working: "Working",
  completed: "Completed"
}

class Column extends React.Component {
  constructor(props) {
    super(props)
    this.state = { stories: props.stories }
  }

  componentDidMount() {
    this._sortableInstance = Sortable.create(this.refs.sortable, {
      onStart: this.onStart.bind(this),
      onAdd: this.updatePosition.bind(this),
      onUpdate: this.updatePosition.bind(this),
      group: "stories",
      ghostClass: 'story-card--placeholder',
    });
  }

  onStart(evt) {
    _nextSibling   = evt.item.nextElementSibling;
    _draggedFrom   = this;
    _draggingStory = this.state.stories.get(evt.oldIndex)
  }

  updatePosition(evt) {
    evt.from.insertBefore(evt.item, _nextSibling);

    _draggedFrom.removeAt(evt.oldIndex)
    this.insertAt(_draggingStory, evt.newIndex)

    this.props.onDrag(evt.item.dataset.number, evt.from.dataset.column, evt.to.dataset.column, evt.oldIndex, evt.newIndex)
  }

  insertAt(story, index) {
    this.setState({stories: this.state.stories.splice(index, 0, story)})
  }

  removeAt(story, index) {
    this.setState({stories: this.state.stories.remove(index)})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({stories: nextProps.stories})
  }

  componentWillUnmount() {
    this._sortableInstance.destroy()
    this._sortableInstance = null
  }

  render() {
    return (
      <div className={`board__column board__column--${this.props.count}`}>
        <div className="board__column__header">
          <h3>{ columnTitles[this.props.name] }</h3>
        </div>
        <ul ref="sortable" className="stories-list" data-column={this.props.name}>
          {
            this.state.stories.map((story) => {
              return <StoryCard
                key={story.number}
                story={story}
                onUpdate={this.props.onUpdate}
              />
            })
          }
        </ul>
      </div>
    )
  }
}

export default Column
