import React from 'react'
import browserHistory from 'react-router/lib/browserHistory'

import ProjectNav from 'projects/nav'

export default class ProjectSettings extends React.Component {
  selectedClass(tab) {
    if (window.location.href.endsWith(tab)) {
      return 'block-list__item--selected'
    }
    return '';
  }

  goToSettings() {
    browserHistory.replace(`/${this.props.project.slug}/settings`)
  }

  goToCollaborators() {
    browserHistory.replace(`/${this.props.project.slug}/settings/collaborators`)
  }

  render() {
    return (
      <div>
        <ProjectNav activeTab="settings" project={this.props.project}>
          Settings
        </ProjectNav>

        <div className="row">
          <div className="four-columns">
            <nav className="block-list">
              <a onClick={this.goToSettings.bind(this)} className={`block-list__item clickable ${this.selectedClass('settings')}`}>
                Settings
              </a>
              <a onClick={this.goToCollaborators.bind(this)} className={`block-list__item clickable ${this.selectedClass('collaborators')}`}>
                Collaborators
              </a>
            </nav>
          </div>

          <div className="eight-columns">
            {React.cloneElement(this.props.children, this.props)}
          </div>

        </div>
      </div>
    )
  }
}
