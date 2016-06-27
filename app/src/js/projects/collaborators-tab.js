import React from "react"
import update from 'react/lib/update'

import ProjectService from './service'
const projects = new ProjectService()

class ProjectCollaboratorsTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collaborators: null
    }
  }

  componentDidMount() {
    projects.collaborators(this.props.projectId, (collaborators) => {
      this.setState({collaborators: collaborators})
    })
  }

  removeCollaborator(userId) {
    projects.removeCollaborator(this.props.projectId, userId, () => {
      this.removeCollaboratorFromState(userId)
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
        <label>Search by Full Name or Email</label>
        <div className="input-with-button">
          <input type="text" />
          <button className="button primary full-width">Add Collaborator</button>
        </div>
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

export default ProjectCollaboratorsTab
