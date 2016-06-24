import React from "react"
import browserHistory from 'react-router/lib/browserHistory'
import update from 'react/lib/update'

import ProjectService from './service'

const projects = new ProjectService()

class ProjectSettings extends React.Component {
  constructor(props) {
    super(props)
    this.projectId = this.props.routeParams.projectId
    this.state = {
      tab: 'settings'
    }
  }

  componentDidMount() {
    projects.find(this.projectId, (project) => {
      this.setState({
        project: project,
      })
    })
  }

  submit(e) {
    e.preventDefault()
    projects.update(this.state.project, (updated) => {
      this.setState({
        project: updated
      })
    })
  }

  nameChanged(event) {
    this.setState(update(this.state, {project: {name: {$set: event.target.value}}}))
  }

  renderSettings() {
    return (
      <form onSubmit={this.submit.bind(this)}>
        <h2>Settings</h2>
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Name" value={this.state.project.name} onChange={this.nameChanged.bind(this)} />
        </div>
        <button type="submit" className="button primary full-width no-margin">Save</button>
      </form>
    )
  }

  renderCollaborators() {
    return (
      <h2>Collaborators</h2>
    )
  }

  renderNotifications() {
    return (
      <h2>Notifications</h2>
    )
  }

  selectedClass(tab) {
    if (this.state.tab === tab) {
      return 'side-menu__item--selected'
    }
  }

  setTab(newTab) {
    this.setState({tab: newTab})
  }

  renderRightSection() {
    if (this.state.tab === 'settings') {
      return this.renderSettings()
    } else if (this.state.tab === 'collaborators') {
      return this.renderCollaborators()
    } else if (this.state.tab === 'notifications') {
      return this.renderNotifications()
    }
  }

  render() {
    if (!this.state.project) return null

    let rightSection = this.renderRightSection();

    return (
      <div className="row">
        <div className="four-columns">
          <nav className="side-menu">
            <a href="javascript://"
              className={`side-menu__item ${this.selectedClass('settings')}`}
              onClick={ () => this.setTab('settings') }>
              Settings
            </a>
            <a href="javascript://"
              className={`side-menu__item ${this.selectedClass('collaborators')}`}
              onClick={ () => this.setTab('collaborators') }>
              Collaborators
            </a>
            <a href="javascript://"
              className={`side-menu__item ${this.selectedClass('notifications')}`}
              onClick={ () => this.setTab('notifications') }>
              Notifications
            </a>
          </nav>
        </div>

        <div className="eight-columns">
          { rightSection }
        </div>

      </div>
    )
  }
}

export default ProjectSettings
