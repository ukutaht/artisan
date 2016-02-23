import Immutable from 'immutable'
import React from 'react'
import Link from 'react-router/lib/Link'

import ProjectService from './project-service'

const projects = new ProjectService()

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {projects: Immutable.List()}
  }

  componentDidMount() {
    projects.all((projects) => {
      console.log(projects.toJS())
      this.setState({projects: projects})
    })
  }

  render() {
    return (
      <div>
        <div className="dashboard-column">
          <h2 className="dashboard-column__header">Current Stories</h2>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-column__header">
            <h2 className="inline-block">Projects</h2>
            <Link to="/projects/new">
              <button className="button primary create-project no-margin">Create project</button>
            </Link>
          </div>

          <ul className="projects-list">
            { this.state.projects.map((project) => {
                return (
                  <li className="projects-list__item" key={project.id}>
                    <Link to="/board">{project.name}</Link>
                    <Link to="javascript://" className="projects-list__item__settings">
                      <i className="ion-gear-b right-padded-icon"></i>Settings
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default Dashboard
