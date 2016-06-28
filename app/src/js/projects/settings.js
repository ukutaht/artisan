import React from 'react'

import ProjectSettingsTab from './settings-tab'
import ProjectCollaboratorsTab from './collaborators-tab'

class ProjectSettings extends React.Component {
  constructor(props) {
    super(props)
    this.projectId = this.props.routeParams.projectId
    this.state = {
      tab: 'settings'
    }
  }

  renderNotifications() {
    return (
      <h2>Notifications</h2>
    )
  }

  selectedClass(tab) {
    if (this.state.tab === tab) {
      return 'block-list__item--selected'
    }
  }

  setTab(newTab) {
    this.setState({tab: newTab})
  }

  renderRightSection() {
    if (this.state.tab === 'settings') {
      return <ProjectSettingsTab projectId={this.projectId} />
    } else if (this.state.tab === 'collaborators') {
      return <ProjectCollaboratorsTab projectId={this.projectId}/>
    } else if (this.state.tab === 'notifications') {
      return this.renderNotifications()
    }
  }

  render() {
    const rightSection = this.renderRightSection();

    return (
      <div className="row">
        <div className="four-columns">
          <nav className="block-list">
            <a href="javascript://"
              className={`block-list__item ${this.selectedClass('settings')}`}
              onClick={() => this.setTab('settings')}>
              Settings
            </a>
            <a href="javascript://"
              className={`block-list__item ${this.selectedClass('collaborators')}`}
              onClick={() => this.setTab('collaborators')}>
              Collaborators
            </a>
            <a href="javascript://"
              className={`block-list__item ${this.selectedClass('notifications')}`}
              onClick={() => this.setTab('notifications')}>
              Notifications
            </a>
          </nav>
        </div>

        <div className="eight-columns">
          {rightSection}
        </div>

      </div>
    )
  }
}

export default ProjectSettings
