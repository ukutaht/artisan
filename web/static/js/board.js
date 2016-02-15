import React from "react"
import Link from 'react-router/lib/Link'
import Immutable from 'immutable'

import StoryCard from './story-card'

const Story = new Immutable.Record({
    name: '',
    number: null,
    estimate: null,
    optimistic: null,
    realistic: null,
    pessimistic: null,
    column: 'backlog'
})

const columns = Immutable.Map({
  backlog: Immutable.List([
    new Story({
      name: "Find better way of organizing web helpers",
      number: 1,
      optimistic: 1,
      realistic: 1,
      pessimistic: 2,
      estimate: 1.5,
      column: "backlog",
    }),
    new Story({
      name: "Add a ticket type for a non-JCR event",
      number: 2,
      optimistic: 3,
      realistic: 3,
      pessimistic: 3,
      estimate: 3,
      column: "backlog",
    }),
    new Story({
      name: "Child ages: make the new designs work",
      number: 3,
      optimistic: 1,
      realistic: 2,
      pessimistic: 3,
      estimate: 2.75,
      column: "backlog",
    }),
  ]),
  ready: Immutable.List([
    new Story({
      name: "BUG: No hotels found returns 503",
      number: 1,
      optimistic: 1,
      realistic: 2,
      pessimistic: 2,
      estimate: 2.25,
      column: "ready",
    }),
    new Story({
      name: "Allow admin to write description for events.",
      number: 2,
      optimistic: 1,
      realistic: 2,
      pessimistic: 4,
      estimate: 3.25,
      column: "ready",
    }),
  ]),
  working: Immutable.List([
    new Story({
      name: "[BUG] dev serving of CSS-referenced image assets",
      number: 2,
      optimistic: 1,
      realistic: 2,
      pessimistic: 3,
      estimate: 2.75,
      column: "working",
    }),
  ]),
  completed: Immutable.List([
    new Story({
      name: "Move GA snippet to end of <head>",
      number: 2,
      column: "completed",
    }),
    new Story({
      name: "Fix 'contact us'",
      number: 3,
      optimistic: 1,
      realistic: 1,
      pessimistic: 1,
      estimate: 1,
      column: "completed",
    }),
  ])
})

const columnTitles = {
  backlog: "Backlog",
  ready: "Ready",
  working: "Working",
  completed: "Completed"
}

const viewWithoutBacklog = ["ready", "working", "completed"]
const viewWithBacklog = ["backlog", "ready", "working", "completed"]

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleColumns: viewWithoutBacklog,
      columns: columns
    };
  }

  updateStory(story) {
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
