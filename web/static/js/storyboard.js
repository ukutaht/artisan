import React from 'react'
import Link from 'react-router/lib/Link'
import Immutable from 'immutable'

import Column from './column'
import StoryService from './story-service'
import StoryModal from './stories/modal'
import Story from './stories/story'
import BoardSocket from './board-socket'

const stories = new StoryService()

class StoryBoard extends React.Component {
  constructor(props) {
    super(props)
    this.projectId = this.props.routeParams.projectId
    this.movesAllowed = true
    this.state = {
      visibleColumns: Immutable.List(["ready", "working", "completed"]),
      columns: Immutable.fromJS({backlog: [], ready: [], working: [], completed: []}),
      addStoryIsOpen: false,
      editingStory: null
    }
  }

  componentDidMount() {
    stories.getByColumn(this.projectId, (columns) => {
      this.setState({columns: this.state.columns.merge(columns)})
    })

    let boardSocket = new BoardSocket(this.projectId)
    boardSocket.join({
      onAddStory: this.receiveStoryAdd.bind(this),
      onUpdateStory: this.doUpdateStory.bind(this),
      onMoveStory: this.doMoveStory.bind(this),
    })
  }

  updateStory(story) {
    stories.update(story, (updated) => {
      this.setState({editingStory: null})
      this.doUpdateStory(updated)
    });
  }

  doUpdateStory(story) {
    let updatedColumns = this.state.columns.update(story.state, (column) => {
      let index = column.findIndex((existing) => existing.number == story.number)
      return column.update(index, (existing) => existing.merge(story))
    })

    this.setState({columns: updatedColumns})
  }

  storyDragged(storyId, from, to, oldIndex, newIndex, done) {
    stories.move(storyId, to, newIndex, (updated) => {
      done()
      this.movesAllowed = true
      this.doMoveStory(updated)
    })
  }

  disallowMoves() {
    this.movesAllowed = false
  }

  doMoveStory(updatedColumns) {
    if (this.movesAllowed) {
      this.setState({
        columns: this.state.columns.merge(updatedColumns)
      })
    }
  }

  showUpdateModal(story) {
    this.setState({editingStory: story})
  }

  renderColumns() {
    let count = this.state.visibleColumns.size

    return this.state.visibleColumns.map((column) => {
      return <Column stories={this.state.columns.get(column)}
              key={column}
              count={count}
              name={column}
              onStoryClick={this.showUpdateModal.bind(this)}
              onDragStart={this.disallowMoves.bind(this)}
              onDrag={this.storyDragged.bind(this)}
              />

    })
  }

  isBacklogVisible() {
    return this.state.visibleColumns.first() === "backlog";
  }

  showBacklog() {
    this.setState({visibleColumns: this.state.visibleColumns.unshift("backlog")});
  }

  hideBacklog() {
    this.setState({visibleColumns: this.state.visibleColumns.shift()});
  }

  backlogLink() {
    if (this.isBacklogVisible()) {
      return (
        <a href="javascript://" onClick={this.hideBacklog.bind(this)}>
          Hide Backlog
          <i className="left-padded-icon ion-chevron-right"></i>
        </a>
      )
    } else {
      return (
        <a href="javascript://" onClick={this.showBacklog.bind(this)}>
          <i className="right-padded-icon ion-chevron-left"></i>
          Show Backlog
        </a>
      )
    }
  }

  openAddStory() {
    this.setState({addStoryIsOpen: true})
  }

  closeAddStory() {
    this.setState({addStoryIsOpen: false})
  }

  receiveStoryAdd(story) {
    let updatedColumns = this.state.columns.update(story.state, (column) => {
      return column.unshift(story)
    })

    this.setState({columns: updatedColumns})
  }

  addStory(story) {
    let firstColumn = this.state.visibleColumns.first()
    let storyWithColumn = story.merge({state: firstColumn})

    stories.add(this.projectId, storyWithColumn, (created) => {
      let updatedColumns = this.state.columns.update(firstColumn, (column) => {
        return column.unshift(created)
      })

      this.setState({columns: updatedColumns, addStoryIsOpen: false})
    })
  }

  renderAddStoryModal() {
    if (this.state.addStoryIsOpen) {
      return (
        <StoryModal story={new Story()}
                    onClose={this.closeAddStory.bind(this)}
                    onSubmit={this.addStory.bind(this)}
                    header="Add story"
                    buttonText="Create" />
      )
    }
  }

  closeEditStory() {
    this.setState({editingStory: null})
  }

  renderEditStoryModal() {
    if (this.state.editingStory) {
      return (
        <StoryModal story={this.state.editingStory}
                    onClose={this.closeEditStory.bind(this)}
                    onSubmit={this.updateStory.bind(this)}
                    header="Edit story"
                    buttonText="Update" />
      )
    }
  }

  render() {
    return (
      <div className="board">
        { this.renderAddStoryModal() }
        { this.renderEditStoryModal() }
        <nav className="board__nav">
          <ul className="board__nav__breadcrumb">
            <li>
              <span>Faros</span>
            </li>

            <li>
              <span>Iteration 18</span>
            </li>
          </ul>

          <select className="board__nav__dropdown">
            <option>Go to...</option>
            <option>Story board</option>
            <option>Full backlog</option>
          </select>
        </nav>

        <div className="board__actions">
          <div className="board__actions__left">
            { this.backlogLink() }
          </div>

          <div className="board__actions__right">
            <button className="button primary">Complete iteration</button>
            <button className="button primary" onClick={this.openAddStory.bind(this)}>
              <i className="right-padded-icon ion-plus"></i> Add story
            </button>
          </div>
        </div>

        { this.renderColumns() }

      </div>
    )
  }
}

export default StoryBoard
