import React from 'react'
import update from 'react/lib/update'

class ProjectSettingsTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.project
  }

  componentWillReceiveProps(newProps) {
    this.state = newProps.project
  }

  save(e) {
    e.preventDefault()
    this.props.updateProject(this.state)
  }

  nameChanged(event) {
    this.setState(update(this.state, {name: {$set: event.target.value}}))
  }

  render() {
    return (
      <form onSubmit={this.save.bind(this)}>
        <h2>Settings</h2>
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Name" value={this.state.name} onChange={this.nameChanged.bind(this)} />
        </div>
        <button type="submit" className="button primary full-width no-margin">Save</button>
      </form>
    )
  }
}

export default ProjectSettingsTab
