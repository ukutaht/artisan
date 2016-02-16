import React from 'react'
import Sortable from 'sortablejs'

import StoryCard from './story-card'

var _nextSibling;

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
    this._sortableInstance = Sortable.create(this.refs.sortable, {
      onStart: this.onStart.bind(this),
      onAdd: this.updatePosition.bind(this),
      onUpdate: this.updatePosition.bind(this),
      group: "stories",
      ghostClass: 'story-card--placeholder',
    });
  }

  onStart(evt) {
    _nextSibling = evt.item.nextElementSibling;
  }

  updatePosition(evt) {
    evt.from.insertBefore(evt.item, _nextSibling);

    this.props.onDrag(Number(evt.item.dataset.number), evt.from.dataset.column, evt.to.dataset.column, evt.oldIndex, evt.newIndex)
  }

  componentWillUnmount() {
    this._sortableInstance.destroy()
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
