import React from 'react'
import browserHistory from 'react-router/lib/browserHistory'

import ProjectNav from 'projects/nav'

function selectedClass(tab) {
  if (window.location.href.endsWith(tab)) {
    return 'block-list__item--selected'
  }
  return '';
}

function goto(project, path) {
  return () => {
    browserHistory.replace(`/${project.slug}/${path}`)
  }
}

export default function ProjectSettings(props) {
  return (
    <div>
      <ProjectNav activeTab="settings" project={props.project}>
        Settings
      </ProjectNav>

      <div className="row">
        <div className="four-columns">
          <nav className="block-list">
            <a onClick={goto(props.project, 'settings')} className={`block-list__item clickable ${selectedClass('settings')}`}>
              Settings
            </a>
            <a onClick={goto(props.project, 'settings/collaborators')} className={`block-list__item clickable ${selectedClass('collaborators')}`}>
              Collaborators
            </a>
          </nav>
        </div>

        <div className="eight-columns">
          {React.cloneElement(props.children, props)}
        </div>

      </div>
    </div>
  )
}
