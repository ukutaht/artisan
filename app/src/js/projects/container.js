import React from 'react'
import update from 'react/lib/update'

import ProjectService from 'projects/service'
const projects = new ProjectService()

function nameSort(users) {
  users.sort((user1, user2) => user1.name > user2.name)
}

export default class ProjectContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    projects.find(this.props.routeParams.slug).then((project) => {
      nameSort(project.collaborators)
      this.setState({project: project})
    })
  }

  projectId() {
    return this.state.project.id
  }

  updateProject(id, attrs) {
    projects.update(id, attrs).then((updated) => {
      this.setState({project: updated})
    })
  }

  addCollaborator(user) {
    return projects
      .addCollaborator(this.projectId(), user.id)
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
      .removeCollaborator(this.projectId(), userId)
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

  render() {
    if (!this.state.project) return null

    return React.cloneElement(this.props.children, {
      project: this.state.project,
      updateProject: this.updateProject.bind(this),
      addCollaborator: this.addCollaborator.bind(this),
      removeCollaborator: this.removeCollaborator.bind(this)
    });
  }
}
