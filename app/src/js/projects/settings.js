import React from 'react'
import Link from 'react-router/lib/Link'

import ProjectNav from 'projects/nav'

export default class ProjectSettings extends React.Component {
  selectedClass(tab) {
    if (window.location.href.endsWith(tab)) {
      return 'block-list__item--selected'
    }
  }

  render() {
    const slug = this.props.project.slug

    return (
      <div>
        <ProjectNav activeTab="settings" project={this.props.project}>
          Settings
        </ProjectNav>

        <div className="row">
          <div className="four-columns">
            <nav className="block-list">
              <Link to={`/${slug}/settings`} className={`block-list__item ${this.selectedClass('settings')}`}>
                Settings
              </Link>
              <Link to={`/${slug}/settings/collaborators`} className={`block-list__item ${this.selectedClass('collaborators')}`}>
                Collaborators
              </Link>
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
