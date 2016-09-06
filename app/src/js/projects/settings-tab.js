import React from 'react'
import InputWithError from 'forms/input-with-error'

export default class ProjectSettingsTab extends React.Component {
  componentWillMount() {
    document.title = `${this.props.project.name} | Settings`

    this.setState({
      form: {
        name: this.props.project.name,
        slug: this.props.project.slug
      },
      formErrors: {}
    })
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      form: {
        name: newProps.project.name,
        slug: newProps.project.slug
      }
    })
  }

  save(e) {
    e.preventDefault()

    const formErrors = this.validate()
    if (Object.keys(formErrors).length > 0) {
      this.setState({
        formErrors: formErrors
      })
    } else {
      this.setState({formErrors: {}})
      this.props.updateProject(this.props.project.id, this.state.form)
    }
  }

  change(field, e) {
    this.setState({
      form: Object.assign({}, this.state.form, {[field]: e.target.value})
    })
  }

  validate() {
    const formErrors = {}
    const {form} = this.state

    if (form.name === '') {
      formErrors['name'] = 'Cannot be blank'
    }
    if (!form.slug.match(/^[a-z0-9-]+$/)) {
      formErrors['slug'] = 'Can only use lower case letters, numbers, and dashes'
    }
    if (form.slug === '') {
      formErrors['slug'] = 'Cannot be blank'
    }

    return formErrors
  }

  render() {
    return (
      <form onSubmit={this.save.bind(this)}>
        <h2>Settings</h2>
        <div className="form-group">
          <label>Name</label>
          <InputWithError type="text" error={this.state.formErrors.name} value={this.state.form.name} onChange={this.change.bind(this, 'name')} />
        </div>
        <div className="form-group">
          <label>Slug</label>
          <br />
          <small>Identifier for this project used in the URL i.e. <em>https://artisan.com/<strong>{this.state.form.slug}</strong></em></small>
          <InputWithError type="text" error={this.state.formErrors.slug} value={this.state.form.slug} onChange={this.change.bind(this, 'slug')} />
        </div>
        <button type="submit" className="button primary full-width no-margin">Save</button>
      </form>
    )
  }
}
