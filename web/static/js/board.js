import React from "react"
import { Link } from 'react-router'

const columns = {
  backlog: [
    {
      name: "BUG: No hotels found returns 503",
      number: 1,
      estimate: 1.75
    },
    {
      name: "Add a ticket type for a non-JCR event",
      number: 2,
      estimate: 3.00
    },
    {
      name: "Child ages: make the new designs work",
      number: 3,
      estimate: 5.5
    },
  ],
  ready: [
    {
      name: "BUG: No hotels found returns 503",
      number: 1,
      estimate: 1.75
    },
    {
      name: "Add a ticket type for a non-JCR event",
      number: 2,
      estimate: 3.00
    },
  ],
  working: [
    {
      name: "Add a ticket type for a non-JCR event",
      number: 2,
      estimate: 3.00
    },
  ],
  completed: [
    {
      name: "Add a ticket type for a non-JCR event",
      number: 2,
      estimate: 3.00
    },
    {
      name: "Child ages: make the new designs work",
      number: 3,
      estimate: 5.5
    },
  ]
}

const columnTitles = {
  backlog: "Backlog",
  ready: "Ready",
  working: "Working",
  completed: "Completed"
}

const visibleColumns = [
  "ready", "working", "completed"
]

class StoryCard extends React.Component {
  name() { return this.props.story.name }
  number() { return this.props.story.number }
  estimate() { return this.props.story.estimate }

  render() {
    return (
      <li className="stories-list__item">
        <div>
          <Link to="javascript://" title={this.name()} className="truncated-text">
            #{this.number()} {this.name()}
          </Link>
          <span className="stories-list__item__estimate">
            <i className="ion-connection-bars right-padded-icon"></i>{this.estimate()}
          </span>
        </div>
        <div className="stories-list__item__assignee-line">
          <i className="ion-person"></i>
        </div>
      </li>
    )
  }
}

const viewWithoutBacklog = ["ready", "working", "completed"]
const viewWithBacklog = ["backlog", "ready", "working", "completed"]

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visibleColumns: viewWithoutBacklog};
  }

  renderColumn(column, count) {
    return (
      <div className={"board__column board__column--" + count} key={column}>
        <div className="board__column__header">
          <h3>{ columnTitles[column] }</h3>
        </div>
        <ul className="stories-list">
          { columns[column].map((story) => <StoryCard key={story.number} story={story} />)}
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
