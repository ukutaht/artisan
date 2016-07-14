import React from 'react'
import update from 'react/lib/update'

import CollaboratorsSearch from './collaborators-search'
import ProjectService from './service'
const projects = new ProjectService()

export default class CollaboratorsTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collaborators: null,
    }
  }

  componentDidMount() {
    projects.find(this.props.projectId).then((project) => {
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
        this.setState(update(this.state, {
          collaborators: {$unshift: [user]},
        }))
      })
  }

  removeCollaboratorFromState(userId) {
    const updated = update(this.state, {collaborators: {$apply: (cbs) => {
      return cbs.filter((cb) => cb.id !== userId)
    }}})

    this.setState(updated)
  }

  collaboratorItem(collaborator) {
    return (
      <li className="block-list__item collaborator" key={collaborator.id}>
        {collaborator.name}
        <br />
        <small>{collaborator.email}</small>
        <i className="ion-close clickable pull-right right-padded-icon"
           onClick={() => this.removeCollaborator(collaborator.id)}></i>
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
