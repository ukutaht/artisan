import React from 'react'
import Link from 'react-router/lib/Link'

function activeClass(props, tab) {
  return props.activeTab === tab ? 'active' : ''
}


export default function ProjectNav(props) {
  return (
    <nav className="project__nav">
    <ul className="project__nav__breadcrumb">
      <li>
        <Link to={`/${props.project.slug}`} >{props.project.name}</Link>
      </li>

      <li>
        {props.children}
      </li>
    </ul>

    <div className="project__nav__tabs">
      <Link to={`/${props.project.slug}`}
        className={activeClass(props, 'storyboard')}>
        <i className="ion-grid right-padded-icon" />
        Story board
      </Link>

      <Link to={`/${props.project.slug}/settings`}
        className={activeClass(props, 'settings')}>
        <i className="ion-gear-b right-padded-icon" />
        Settings
      </Link>
    </div>
    </nav>
  )
}
