import React from "react"
import Link from 'react-router/lib/Link'

import StoryCard from './story-card'
import StoryService from './story-service'

const columnTitles = {
  backlog: "Backlog",
  ready: "Ready",
  working: "Working",
  completed: "Completed"
}

const viewWithoutBacklog = ["ready", "working", "completed"]
const viewWithBacklog = ["backlog", "ready", "working", "completed"]
const stories = new StoryService()

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleColumns: viewWithoutBacklog,
      columns: stories.all()
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

  renderColumn(column, count) {
    return (
      <div className={"board__column board__column--" + count} key={column}>
        <div className="board__column__header">
          <h3>{ columnTitles[column] }</h3>
        </div>
        <ul className="stories-list">
          { this.state.columns.get(column).map((story) => <StoryCard key={story.number} story={story} onUpdate={this.updateStory.bind(this)} />)}
        </ul>
      </div>
    )
  }

  renderColumns() {
    let count = this.state.visibleColumns.length
    return this.state.visibleColumns.map((column) => this.renderColumn(column, count))
  }

  isBacklogVisible() {
    return this.state.visibleColumns[0] === "backlog";
  }

  showBacklog() {
    this.setState({visibleColumns: viewWithBacklog});
  }

  hideBacklog() {
    this.setState({visibleColumns: viewWithoutBacklog});
  }

  render() {
    var backlogLink;
    if (this.isBacklogVisible()) {
      backlogLink = <a href="javascript://" onClick={this.hideBacklog.bind(this)}>Hide Backlog <i className="left-padded-icon ion-chevron-right"></i></a>
    } else {
      backlogLink = <a href="javascript://" onClick={this.showBacklog.bind(this)}><i className="right-padded-icon ion-chevron-left"></i> Show Backlog</a>
    }

    return (
      <div className="board">
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
            { backlogLink }
          </div>

          <div className="board__actions__right">
            <button className="button primary">Complete iteration</button>
            <button className="button primary">
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
