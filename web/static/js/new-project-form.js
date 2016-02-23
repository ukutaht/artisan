import React from "react"

import ProjectService from './project-service'

const projects = new ProjectService()

class NewProjectForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {name: ""}
  }

  submit(e) {
    e.preventDefault()
    projects.create(this.state, (project) => {
      console.log(project)
    })
  }

  nameChanged(event) {
    this.setState({name: event.target.value})
  }

  render() {
    return (
      <div>
        <form className="new-project-form" onSubmit={this.submit.bind(this)}>
          <div className="new-project-form__header">
            <h2>New project</h2>
          </div>
          <div className="new-project-form__header--right">
            or <a href="javascript://">import from Artisan v1</a>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Name" value={this.state.name} onChange={this.nameChanged.bind(this)} />
          </div>
          <button type="submit" className="button primary full-width no-margin">Create</button>
        </form>
      </div>
    )
  }
}

export default NewProjectForm
