import React from "react"
import { Link } from 'react-router'

const stories = [
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
]

class Board extends React.Component {
  render() {
    return(
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
            <Link to="javascript://"><i className="padded-icon ion-chevron-left"></i> Show Backlog</Link>
          </div>

          <div className="board__actions__right">
            <button className="button primary">Complete iteration</button>
            <button className="button primary">
              <i className="padded-icon ion-plus"></i> Add story
            </button>
          </div>
        </div>

        <div className="board__column">
          <div className="board__column__header">
            <h3>Ready</h3>
          </div>
          <ul className="stories-list">
            { stories.map((story) => {
              return (<li key={story.number} className="stories-list__item">
                <div>
                  <Link to="javascript://" title={story.name} className="truncated-text">
                    #{story.number} {story.name}
                  </Link>
                  <span className="stories-list__item__estimate">
                    <i className="ion-connection-bars padded-icon"></i>{story.estimate}
                  </span>
                </div>
                <div className="stories-list__item__assignee-line">
                  <i className="ion-person"></i>
                </div>
              </li>
              )}
            )}
          </ul>
        </div>

        <div className="board__column">
          <div className="board__column__header">
            <h3>Working</h3>
          </div>
        </div>

        <div className="board__column">
          <div className="board__column__header">
            <h3>Completed</h3>
          </div>
        </div>
      </div>
    )
  }
}

export default Board
