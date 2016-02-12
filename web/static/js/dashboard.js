import React from "react"
import { Link } from 'react-router'

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <div className="dashboard-column">
          <h2 className="dashboard-column__header">Current Stories</h2>
        </div>

        <div className="dashboard-column">
          <h2 className="dashboard-column__header">Current Projects</h2>

          <ul className="projects-list">
            <li className="projects-list__item">
              <Link to="/board">Racingbreaks</Link>
              <Link to="javascript://" className="projects-list__item__settings">
                <i className="ion-gear-b right-padded-icon"></i>Settings
              </Link>
            </li>
            <li className="projects-list__item">
              <Link to="/board">Faros</Link>
              <Link to="javascript://" className="projects-list__item__settings">
                <i className="ion-gear-b right-padded-icon"></i>Settings
              </Link>
            </li>
            <li className="projects-list__item">
              <Link to="/board">Artisan</Link>
              <Link to="javascript://" className="projects-list__item__settings">
                <i className="ion-gear-b right-padded-icon"></i>Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Dashboard
