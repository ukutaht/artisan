import React from "react"
import { Link } from 'react-router'

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
            <li className="stories-list__item">
              <div className="stories-list__item__title-line">
                <Link to="javascript://">#513 Add a ticket type for a...</Link>
                <span className="stories-list__item__estimate">
                  <i className="ion-connection-bars padded-icon"></i>1.5
                </span>
              </div>
              <div className="stories-list__item__assignee-line">
                <i className="ion-person"></i>
              </div>
            </li>

            <li className="stories-list__item">
              <div className="stories-list__item__title-line">
                <Link to="javascript://">#513 Add a ticket type for a...</Link>
                <span className="stories-list__item__estimate">
                  <i className="ion-connection-bars padded-icon"></i>1.5
                </span>
              </div>
              <div className="stories-list__item__assignee-line">
                <i className="ion-person"></i>
              </div>
            </li>

            <li className="stories-list__item">
              <div className="stories-list__item__title-line">
                <Link to="javascript://">#513 Add a ticket type for a...</Link>
                <span className="stories-list__item__estimate">
                  <i className="ion-connection-bars padded-icon"></i>1.5
                </span>
              </div>
              <div className="stories-list__item__assignee-line">
                <i className="ion-person"></i>
              </div>
            </li>
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
