import React from 'react'
import Link from 'react-router/lib/Link'
import browserHistory from 'react-router/lib/browserHistory'

import * as users from 'users/service'
import InputWithError from 'forms/input-with-error'

const BAD_REQUEST = 400;
const FORBIDDEN = 403;

class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formErrors: {},
      tokenError: null,
      form: {
        email: '',
        name: '',
        password: '',
        passwordConfirmation: ''
      }
    }
  }

  validate() {
    const formErrors = {}
    const {form} = this.state

    if (form.name === '') {
      formErrors['name'] = 'Cannot be blank'
    }
    if (form.email === '') {
      formErrors['email'] = 'Cannot be blank'
    }
    if (form.password.length < 6) {
      formErrors['password'] = 'Must be at least 6 characters long'
    }
    if (form.password !== form.passwordConfirmation) {
      formErrors['passwordConfirmation'] = 'Must match the password'
    }

    return formErrors
  }

  onSubmit(e) {
    e.preventDefault()

    const formErrors = this.validate()
    if (Object.keys(formErrors).length > 0) {
      this.setState({
        formErrors: formErrors
      })
    } else {
      this.setState({formErrors: {}})
      const token = this.props.location.query.token || null

      users.signup(this.state.form, token).then(() => {
        browserHistory.push('/')
      }).catch(this.handleApiError.bind(this))
    }
  }

  handleApiError(e) {
    if (e.status === BAD_REQUEST) {
      this.setState({
        formErrors: e.response.body.errors
      })
    } else if (e.status === FORBIDDEN) {
      this.setState({
        tokenError: e.response.text
      })
    }
  }

  renderTokenError() {
    if (this.state.tokenError) {
      return (
        <div className="error-box">
          {this.state.tokenError}
        </div>
      )
    }
    return false;
  }

  change(field, e) {
    this.setState({
      form: Object.assign({}, this.state.form, {[field]: e.target.value})
    })
  }

  render() {
    return (
      <div className='skinny-box'>
        <div className="login-header">
          <h2 className="space-bottom-tiny">Sign up for Artisan</h2>
          <p className="space-top-tiny">Or <Link className="blue" to="/login">log in</Link> instead</p>
        </div>
        {this.renderTokenError()}
        <form noValidate={true} onSubmit={this.onSubmit.bind(this)}>
          <div className='form-group'>
            <InputWithError error={this.state.formErrors['email']} value={this.state.form.email} onChange={this.change.bind(this, 'email')} type='email' placeholder="Email"/>
          </div>
          <div className='form-group'>
            <InputWithError error={this.state.formErrors['name']} value={this.state.form.name} onChange={this.change.bind(this, 'name')} type='text' placeholder="Full name" />
          </div>
          <div className='form-group'>
            <InputWithError error={this.state.formErrors['password']} value={this.state.form.password} onChange={this.change.bind(this, 'password')} type='password' placeholder="Password" />
          </div>
          <div className='form-group'>
            <InputWithError error={this.state.formErrors['passwordConfirmation']} value={this.state.form.passwordConfirmation} onChange={this.change.bind(this, 'passwordConfirmation')} type='password' placeholder="Confirm password" />
          </div>
          <button className='button primary no-margin full-width'>Sign up</button>
        </form>
      </div>
    )
  }
}

export default Signup
