import React from 'react'
import Sortable from 'sortablejs'

import StoryCard from 'stories/card'

let _nextSibling;
let _ghost;
let _fromColumn;
let _toColumn;
let _dragging = false;

const _sortableInstances = {
  backlog: null,
  ready: null,
  working: null,
  completed: null,
};

const columnTitles = {
  backlog: 'Backlog',
  ready: 'Ready',
  working: 'Working',
  completed: 'Completed'
}

function setSortDisabled(value) {
  for (const columnName of Object.keys(_sortableInstances)) {
    if (_sortableInstances[columnName]) {
      _sortableInstances[columnName].option('disabled', value)
    }
  }
}

function enableSortables() {
  setSortDisabled(false)
}

function disableSortables() {
  setSortDisabled(true)
}

class Column extends React.Component {
  componentDidMount() {
    _sortableInstances[this.props.name] = Sortable.create(this.refs.sortable, {
      onStart: this.onStart.bind(this),
      onAdd: this.updatePosition.bind(this),
      onUpdate: this.updatePosition.bind(this),
      onMove: this.onMove.bind(this),
      onEnd: this.onEnd.bind(this),
      group: 'stories',
      ghostClass: 'story-card--ghost'
    });
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.online) {
      disableSortables()
    } else {
      enableSortables()
    }
  }

  onStart(evt) {
    _fromColumn  = this.props.name
    _dragging    = true
    _nextSibling = evt.item.nextElementSibling;
    _ghost = this.refs.sortable.getElementsByClassName('story-card--ghost')[0].cloneNode(true)
  }

  onMove(evt) {
    _toColumn = evt.to.dataset.column
  }

  onEnd(evt) {
    const sameColumn = _fromColumn === _toColumn
    const sameIndex = evt.newIndex === undefined || evt.oldIndex === evt.newIndex
    if (sameColumn && sameIndex) {
      _dragging = false
    }
  }

  updatePosition(evt) {
    disableSortables()
    evt.to.insertBefore(_ghost, evt.to.children[evt.newIndex]);
    const react_placeholder = evt.from.insertBefore(evt.item, _nextSibling);
    react_placeholder.style.display = 'none';

    this.props.onDrag(Number(evt.item.dataset.id),
                      evt.to.dataset.column,
                      evt.newIndex,
                      () => this.done(evt, react_placeholder),
                      () => this.abort(evt, react_placeholder))
  }

  done(evt, react_placeholder) {
    evt.to.removeChild(_ghost)
    enableSortables()
    _dragging = false
    if (evt.from === evt.to) react_placeholder.style.display = 'block'
  }

  abort(evt, react_placeholder) {
    evt.to.removeChild(_ghost)
    enableSortables()
    _dragging = false
    react_placeholder.style.display = 'block'
  }

  componentWillUnmount() {
    _sortableInstances[this.props.name].destroy()
  }

  shouldComponentUpdate() {
    return !_dragging
  }

  renderStoryPoints() {
    const totalPoints = this.props.stories.reduce((total, {estimate}) => total + estimate, 0)

    if (totalPoints > 0) {
      return (
        <span className="points">
          {totalPoints}
        </span>
      )
    }

    return false
  }

  render() {
    return (
      <div className={`board__column board__column--${this.props.count}`}>
        <div className="board__column__header">
          {this.props.children}
          <h3>{columnTitles[this.props.name]}</h3>
          {this.renderStoryPoints()}
        </div>
        <ul ref="sortable" className="stories-list" data-column={this.props.name}>
          {
            this.props.stories.map((story) => {
              return <StoryCard
                disabled={!this.props.online}
                key={story.id}
                story={story}
                onClick={this.props.onStoryClick}
              />
            })
          }
        </ul>
      </div>
    )
  }
}

export default Column
