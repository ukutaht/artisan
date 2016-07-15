import React from 'react'
import update from 'react/lib/update'

import CollaboratorsSearch from 'projects/collaborators-search'

import ProjectService from 'projects/service'
const projects = new ProjectService()

import UserService from 'users/service'
const users = new UserService()

function userSort(users) {
  users.sort((user1, user2) => user1.name > user2.name)
}

export default class CollaboratorsTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collaborators: null,
    }
  }

  componentDidMount() {
    projects.find(this.props.projectId).then((project) => {
      userSort(project.collaborators)
      this.setState({collaborators: project.collaborators})
    })
  }

  removeCollaborator(userId) {
    projects
      .removeCollaborator(this.props.projectId, userId)
      .then(() => {
        this.removeCollaboratorFromState(userId)
      })
  }

  addCollaborator(user) {
    return projects
      .addCollaborator(this.props.projectId, user.id)
      .then(() => {
        const newState = update(this.state, {
          collaborators: {$unshift: [user]},
        })
        userSort(newState.collaborators)

        this.setState(newState)
      })
  }

  removeCollaboratorFromState(userId) {
    const updated = update(this.state, {collaborators: {$apply: (cbs) => {
      return cbs.filter((cb) => cb.id !== userId)
    }}})

    this.setState(updated)
  }

  removeIcon(collaborator) {
    if (collaborator.id === users.current.id) {
      return null
    } else {
      return <i className="ion-close clickable pull-right right-padded-icon"
         onClick={() => this.removeCollaborator(collaborator.id)}></i>
    }
  }

  collaboratorItem(collaborator) {
    return (
      <li className="block-list__item collaborator" key={collaborator.id}>
        {collaborator.name}
        <br />
        <small>{collaborator.email}</small>
        {this.removeIcon(collaborator)}
      </li>
    )
  }

  render() {
    if (!this.state.collaborators) return null

    return (
      <div>
        <h2>Collaborators</h2>
        <CollaboratorsSearch projectId={this.props.projectId} addCollaborator={this.addCollaborator.bind(this)}/>
        <ul className="block-list">
          {
            this.state.collaborators.map((collaborator) => {
              return this.collaboratorItem(collaborator)
            })
          }
        </ul>
      </div>
    )
  }
}
