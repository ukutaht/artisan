import React from 'react'

import ProjectService from './service'
const projects = new ProjectService()

const UP_ARROW = 38
const DOWN_ARROW = 40
const ENTER = 13
const ESCAPE = 27

export default class CollaboratorsSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      searchResults: [],
      showResults: false,
      selectedIndex: 0,
      selectedUser: null,
    }
  }

  addCollaborator() {
    this.props.addCollaborator(this.state.selectedUser)
      .then(() => {
        this.setState({
          selectedUser: null,
          query: ''
        })
      })
  }

  queryChanged(e) {
    this.setState({
      query: e.target.value,
      selectedUser: null
    })

    if (e.target.value.length < 1) {
      this.hideResults()
    } else {
      projects.autocompleteCollaborators(this.props.projectId, e.target.value)
        .then((results) => {
          this.setState({
            searchResults: results,
            showResults: true,
          })
        })
    }
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
        <div className="dropdown__content collaborator-results">
          {
            this.state.searchResults.map((result, index) => {
              const active = index === this.state.selectedIndex ? 'active' : ''

              return (
                <a
                  key={result.id}
                  className={`result ${active}`}
                  data-index={index}
                  onMouseOver={this.hoveringOverResult.bind(this)}
                  onClick={this.clickResult.bind(this)}>
                  {result.name} ({result.email})
                </a>
              )
            })
          }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div onKeyDown={this.onKeyDown.bind(this)}>
        <label>Search by Full Name or Email</label>
        <div className="input-with-button">
          <input type="text" value={this.state.query} onChange={this.queryChanged.bind(this)}/>
          <button disabled={!this.state.selectedUser} className="button primary full-width" onClick={this.addCollaborator.bind(this)}>Add Collaborator</button>
        </div>
        {this.renderResults()}
      </div>
    )
  }
}
