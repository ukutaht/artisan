import React from 'react'
import Link from 'react-router/lib/Link'

export default class ProjectNav extends React.Component {
  activeClass(tab) {
    return this.props.activeTab === tab ? 'active' : ''
  }

  render() {
    return (
      <nav className="project__nav">
        <ul className="project__nav__breadcrumb">
          <li>
            <Link to={`/${this.props.project.slug}`} >{this.props.project.name}</Link>
          </li>

          <li>
            {this.props.children}
          </li>
        </ul>

        <div className="project__nav__tabs">
          <Link to={`/${this.props.project.slug}`}
                className={this.activeClass('storyboard')}>
            <i className="ion-grid right-padded-icon" />
            Story board
          </Link>

          <Link to={`/${this.props.project.slug}/settings`}
                className={this.activeClass('settings')}>
            <i className="ion-gear-b right-padded-icon" />
            Settings
          </Link>
        </div>
      </nav>
    )
  }
}
