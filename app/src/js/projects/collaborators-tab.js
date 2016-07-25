import React from 'react'

import CollaboratorsSearch from 'projects/collaborators-search'

import Avatar from 'users/avatar'
import * as users from 'users/service'

export default class CollaboratorsTab extends React.Component {
  componentDidMount() {
    document.title = `${this.props.project.name} | Collaborators`
  }

  removeIcon(collaborator) {
    if (collaborator.id === users.current().id) {
      return null
    } else {
      return <i className="ion-close clickable pull-right right-padded-icon"
         onClick={() => this.props.removeCollaborator(collaborator.id)}></i>
    }
  }

  collaboratorItem(collaborator) {
    return (
      <li className="block-list__item collaborator" key={collaborator.id}>
        <Avatar src={collaborator.avatar} size={35} />
        {collaborator.name}
        <br />
        <small>{collaborator.email}</small>
        {this.removeIcon(collaborator)}
      </li>
    )
  }

  render() {
    return (
      <div>
        <h2>Collaborators</h2>
        <CollaboratorsSearch projectId={this.props.project.id} addCollaborator={this.props.addCollaborator}/>
        <ul className="block-list">
          {
            this.props.project.collaborators.map((collaborator) => {
              return this.collaboratorItem(collaborator)
            })
          }
        </ul>
      </div>
    )
  }
}
