import React from 'react'
import Link from 'react-router/lib/Link'
import update from 'react/lib/update'

import ProjectService from 'projects/service'
const projects = new ProjectService()

function nameSort(users) {
  users.sort((user1, user2) => user1.name > user2.name)
}


class ProjectSettings extends React.Component {
  constructor(props) {
    super(props)
    this.projectId = this.props.routeParams.projectId
    this.state = {}
  }

  componentDidMount() {
    projects.find(this.projectId).then((project) => {
      nameSort(project.collaborators)
      this.setState({project: project})
    })
  }

  updateProject(attrs) {
    projects.update(attrs).then((updated) => {
      this.setState({project: updated})
    })
  }

  addCollaborator(user) {
    return projects
      .addCollaborator(this.projectId, user.id)
      .then(() => {
        const newState = update(this.state, {
          project: {collaborators: {$unshift: [user]}},
        })
        nameSort(newState.project.collaborators)

        this.setState(newState)
      })
  }

  removeCollaborator(userId) {
    projects
      .removeCollaborator(this.projectId, userId)
      .then(() => {
        this.removeCollaboratorFromState(userId)
      })
  }

  removeCollaboratorFromState(userId) {
    const updated = update(this.state, {project: {collaborators: {$apply: (cbs) => {
      return cbs.filter((cb) => cb.id !== userId)
    }}}})

    this.setState(updated)
  }

  selectedClass(tab) {
    if (window.location.href.endsWith(tab)) {
      return 'block-list__item--selected'
    }
  }

  rightSection() {
    if (!this.state.project) return null

    return React.cloneElement(this.props.children, {
      project: this.state.project,
      updateProject: this.updateProject.bind(this),
      addCollaborator: this.addCollaborator.bind(this),
      removeCollaborator: this.removeCollaborator.bind(this)
    });
  }

  render() {
    return (
      <div className="row">
        <div className="four-columns">
          <nav className="block-list">
            <Link to={`/projects/${this.projectId}/settings`} className={`block-list__item ${this.selectedClass('settings')}`}>
              Settings
            </Link>
            <Link to={`/projects/${this.projectId}/settings/collaborators`} className={`block-list__item ${this.selectedClass('collaborators')}`}>
              Collaborators
            </Link>
          </nav>
        </div>

        <div className="eight-columns">
          {this.rightSection()}
        </div>

      </div>
    )
  }
}

export default ProjectSettings
