import React from 'react'

import Select from 'forms/select'
import Modal from 'forms/modal'
import InputWithError from 'forms/input-with-error'
import * as projects from 'projects/service'

export default class Invite extends React.Component {
  constructor() {
    super()
    this.state = {
      email: '',
      error: null,
      project: null,
      projects: [],
    }
  }

  componentDidMount() {
    projects.all().then((projects) => {
      this.setState({projects: projects})
    })
  }

  emailChanged(e) {
    const newEmail = e.target.value

    if (this.state.error && newEmail !== '') {
      this.setState({error: null, email: newEmail})
    } else {
      this.setState({email: newEmail})
    }
  }

  projectChanged(newProjectId) {
    this.setState({project: newProjectId})
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.state.email === '') {
      this.setState({error: 'Email is required'})
    }
  }

  options() {
    const emptyOption = {
      label: 'Choose project to join',
      value: null
    }

    const projectOptions = this.state.projects.map((project) => {
      return {
        label: project.name,
        value: project.id
      }
    })

    return projectOptions.concat(emptyOption)
  }

  render() {
    return (
      <Modal onClose={this.props.onClose}>
        <div className="modal invite-modal">
          <header className="modal__header">
            <h3>Invite</h3>
            <i className="ion-android-close modal__close" onClick={this.props.onClose}></i>
          </header>
          <div className="modal__body row">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <section className="form-group">
                <InputWithError type="text" error={this.state.error} value={this.state.email} onChange={this.emailChanged.bind(this)} placeholder="Email"/>
              </section>

              <Select value={this.state.project} options={this.options()} onChange={this.projectChanged.bind(this)} />

              <button className="button primary no-margin full-width space-top">Invite</button>
            </form>
          </div>
          <div className="modal__footer"></div>
        </div>
      </Modal>
    )
  }
}
