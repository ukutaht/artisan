import React from 'react'
import update from 'react/lib/update'

import ProjectService from 'projects/service'

const projects = new ProjectService()


class ProjectSettingsTab extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    projects.find(this.props.projectId).then((project) => {
      this.setState(project)
    })
  }

  save(e) {
    e.preventDefault()
    projects.update(this.state).then((updated) => {
      this.setState(updated)
    })
  }

  nameChanged(event) {
    this.setState(update(this.state, {name: {$set: event.target.value}}))
  }

  render() {
    if (!this.state) return null;

    return (
      <form onSubmit={this.save.bind(this)}>
        <h2>Settings</h2>
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Name" value={this.state.name} onChange={this.nameChanged.bind(this)} />
        </div>
        <button type="submit" className="button primary full-width no-margin">Save</button>
      </form>
    )
  }
}

export default ProjectSettingsTab
