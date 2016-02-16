import React from 'react'
import Link from 'react-router/lib/Link'
import Immutable from 'immutable'

import Column from './column'
import StoryCard from './story-card'
import StoryService from './story-service'
import StoryModal from './story-modal'
import Story from './story'

const stories = new StoryService()

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleColumns: Immutable.List(["ready", "working", "completed"]),
      columns: stories.byColumn(),
      addStoryIsOpen: false
    };
  }

  updateStory(story) {
    let updated = stories.update(story);

    let updatedColumns = this.state.columns.update(story.column, (column) => {
      let index = column.findIndex((existing) => existing.number == story.number)
      return column.update(index, (existing) => existing.merge(story))
    })

    this.setState({columns: updatedColumns})
  }

  storyDragged(storyNumber, from, to, oldIndex, newIndex) {
    let story = this.state.columns.get(from).find((story) => story.number == storyNumber)

    let updatedColumns = this.state.columns
      .update(from, (column) => {
        return column.remove(oldIndex)
      })
      .update(to, (column) => {
        return column.slice(0, newIndex).push(story).concat(column.slice(newIndex, column.size))
      })

    this.setState({columns: updatedColumns})
  }

  renderColumns() {
    let count = this.state.visibleColumns.size

    return this.state.visibleColumns.map((column) => {
      return <Column stories={this.state.columns.get(column)}
              key={column}
              count={count}
              name={column}
              onDrag={this.storyDragged.bind(this)}/>

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

  addStory(story) {
    let firstColumn = this.state.visibleColumns.first()
    let fullStory   = stories.add(
      story.merge({column: firstColumn})
    )

    let updatedColumns = this.state.columns.update(firstColumn, (column) => {
      return column.unshift(fullStory)
    })

    this.setState({columns: updatedColumns, addStoryIsOpen: false})
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

  render() {
    return (
      <div className="board">
        { this.renderAddStoryModal() }
        <div className="board__nav">
          <ul className="board__nav__breadcrumb">
            <li>
              <Link to="javascript://">Projects</Link>
            </li>

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
        </div>

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

export default Board
