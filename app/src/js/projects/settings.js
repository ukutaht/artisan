import React from "react"
import browserHistory from 'react-router/lib/browserHistory'

import ProjectService from './service'

const projects = new ProjectService()

class ProjectSettings extends React.Component {
  constructor(props) {
    super(props)
    this.projectId = this.props.routeParams.projectId
    this.state = {loaded: false}
  }

  componentDidMount() {
    projects.find(this.projectId, (project) => {
      this.setState({
        name: project.name,
        id: project.id,
        loaded: true,
      })
    })
  }

  submit(e) {
    e.preventDefault()
    projects.update(this.state, (project) => {
      browserHistory.push(`/projects/${project.id}`)
    })
  }

  nameChanged(event) {
    this.setState({name: event.target.value})
  }

  render() {
    if (!this.state.loaded) return null;

    return (
      <div>
        <form onSubmit={this.submit.bind(this)}>
          <div className="row">
            <div className="eight-columns">
              <h2>Project settings</h2>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Name" value={this.state.name} onChange={this.nameChanged.bind(this)} />
              </div>
              <button type="submit" className="button primary full-width no-margin">Save</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default ProjectSettings
