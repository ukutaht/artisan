import React from 'react'
import update from 'react/lib/update'

import ProjectService from './service'
const projects = new ProjectService()

const UP_ARROW = 38
const DOWN_ARROW = 40
const ENTER = 13
const ESCAPE = 27

class ProjectCollaboratorsTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collaborators: null,
      query: '',
      searchResults: [],
      showResults: false,
      selectedIndex: 0,
      selectedUser: null,
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

  addCollaborator() {
    projects.addCollaborator(this.props.projectId, this.state.selectedUser.id, () => {
      this.setState(update(this.state, {
        selectedUser: {$set: null},
        collaborators: {$unshift: [this.state.selectedUser]},
        query: {$set: ''}
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

  queryChanged(e) {
    this.setState({
      query: e.target.value,
      showResults: true,
      selectedUser: null
    })

    if (e.target.value.length < 1) {
      this.hideResults()
    }

    projects.autocompleteCollaborators(this.props.projectId, e.target.value, (results) => {
      this.setState({
        searchResults: results
      })
    })
  }

  onKeyDown(e) {
    const keys = {
      [UP_ARROW]: this.moveUp,
      [DOWN_ARROW]: this.moveDown,
      [ENTER]: this.clickResult,
      [ESCAPE]: this.hideResults
    }

    if (this.state.showResults && e.keyCode in keys) {
      keys[e.keyCode].call(this, e)
    }
  }

  moveUp(e) {
    e.preventDefault()
    this.setState({
      selectedIndex: Math.max(this.state.selectedIndex - 1, 0)
    })
  }

  moveDown(e) {
    e.preventDefault()
    this.setState({
      selectedIndex: Math.min(this.state.selectedIndex + 1, this.state.searchResults.length - 1)
    })
  }

  clickResult() {
    const selectedUser = this.state.searchResults[this.state.selectedIndex]
    this.setState({
      query: selectedUser.name,
      selectedUser: selectedUser
    })

    this.hideResults()
  }

  hideResults() {
    this.setState({
      showResults: false,
      selectedIndex: 0,
      searchResults: [],
    });
  }

  hoveringOverResult(e) {
    this.setState({selectedIndex: Number(e.target.dataset.index)})
  }

  renderResults() {
    if (!this.state.showResults || this.state.searchResults.length === 0) return null

    return (
      <div className="dropdown">
        <ul className="dropdown-menu">
          {
            this.state.searchResults.map((result, index) => {
              const className = index === this.state.selectedIndex ? 'active' : ''

              return (
                <li
                  key={result.id}
                  className={className}
                  data-index={index}
                  onMouseOver={this.hoveringOverResult.bind(this)}
                  onClick={this.clickResult.bind(this)}>
                  {result.name} ({result.email})
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }


  render() {
    if (!this.state.collaborators) return null

    return (
      <div onKeyDown={this.onKeyDown.bind(this)}>
        <h2>Collaborators</h2>
        <label>Search by Full Name or Email</label>
        <div className="input-with-button">
          <input type="text" value={this.state.query} onChange={this.queryChanged.bind(this)}/>
          <button disabled={!this.state.selectedUser} className="button primary full-width" onClick={this.addCollaborator.bind(this)}>Add Collaborator</button>
        </div>
        { this.renderResults() }
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
