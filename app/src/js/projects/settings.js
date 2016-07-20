import React from 'react'
import Link from 'react-router/lib/Link'

import ProjectNav from 'projects/nav'

export default class ProjectSettings extends React.Component {
  constructor(props) {
    super(props)
  }

  selectedClass(tab) {
    if (window.location.href.endsWith(tab)) {
      return 'block-list__item--selected'
    }
  }

  rightSection() {
    return React.cloneElement(this.props.children, this.props);
  }

  render() {
    const projectId = this.props.project.id

    return (
      <div>
        <ProjectNav activeTab="settings" project={this.props.project}>
          Settings
        </ProjectNav>

        <div className="row">
          <div className="four-columns">
            <nav className="block-list">
              <Link to={`/projects/${projectId}/settings`} className={`block-list__item ${this.selectedClass('settings')}`}>
                Settings
              </Link>
              <Link to={`/projects/${projectId}/settings/collaborators`} className={`block-list__item ${this.selectedClass('collaborators')}`}>
                Collaborators
              </Link>
            </nav>
          </div>

          <div className="eight-columns">
            {this.rightSection()}
          </div>

        </div>
      </div>
    )
  }
}
