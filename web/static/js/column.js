import React from 'react'
import Sortable from 'sortablejs'

import StoryCard from './story-card'

var _nextSibling;
var _ghost;

const columnTitles = {
  backlog: "Backlog",
  ready: "Ready",
  working: "Working",
  completed: "Completed"
}

class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.sortableInstance = Sortable.create(this.refs.sortable, {
      onStart: this.onStart.bind(this),
      onAdd: this.updatePosition.bind(this),
      onUpdate: this.updatePosition.bind(this),
      group: "stories",
      ghostClass: 'story-card--ghost',
    });
  }

  onStart(evt) {
    _nextSibling = evt.item.nextElementSibling;
    _ghost = this.refs.sortable.getElementsByClassName('story-card--ghost')[0].cloneNode(true)
  }

  updatePosition(evt) {
    evt.to.insertBefore(_ghost, evt.to.children[evt.newIndex]);
    let react_placeholder = evt.from.insertBefore(evt.item, _nextSibling);
    react_placeholder.style.display = "none";

    this.sortableInstance.option('disabled', true)

    this.props.onDrag(Number(evt.item.dataset.number),
                      evt.from.dataset.column,
                      evt.to.dataset.column,
                      evt.oldIndex,
                      evt.newIndex,
                      () => this.cleanUpDrag(evt, react_placeholder))
  }

  cleanUpDrag(evt, react_placeholder) {
    this.sortableInstance.option('disabled', false)
    evt.to.removeChild(_ghost)
    if (evt.from == evt.to) react_placeholder.style.display = "block"
  }

  componentWillUnmount() {
    this.sortableInstance.destroy()
  }

  render() {
    return (
      <div className={`board__column board__column--${this.props.count}`}>
        <div className="board__column__header">
          <h3>{ columnTitles[this.props.name] }</h3>
        </div>
        <ul ref="sortable" className="stories-list" data-column={this.props.name}>
          {
            this.props.stories.map((story) => {
              return <StoryCard
                key={story.number}
                story={story}
                onUpdate={this.props.onUpdateStory}
              />
            })
          }
        </ul>
      </div>
    )
  }
}

export default Column