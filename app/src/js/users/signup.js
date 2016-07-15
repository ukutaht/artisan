import React from 'react'
import browserHistory from 'react-router/lib/browserHistory'

import UserService from 'users/service'

const users = new UserService()

class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }
  }

  validate() {
    const errors = {}
    const formData = this.getFormData()

    if (formData.name === '') {
      errors['name'] = 'Cannot be blank'
    }
    if (formData.email === '') {
      errors['email'] = 'Cannot be blank'
    }
    if (formData.password.length < 6) {
      errors['password'] = 'Must be at least 6 characters long'
    }
    if (formData.password !== formData.passwordConfirmation) {
      errors['passwordConfirmation'] = 'Must match the password'
    }

    return errors
  }

  getFormData() {
    return {
      name: this.refs.name.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
      passwordConfirmation: this.refs.passwordConfirmation.value
    }
  }

  onSubmit(e) {
    e.preventDefault()

    const errors = this.validate()
    if (Object.keys(errors).length > 0) {
      this.setState({errors: errors})
    } else {
      users.signup(this.getFormData()).then(() => {
        browserHistory.push('/')
      })
    }
  }

  renderError(name) {
    if (this.state.errors[name]) {
      return <span className='input-error'>{this.state.errors[name]}</span>
    }
  }

  render() {
    return (
      <div className='skinny-box'>
        <h2>Sign up for Artisan</h2>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className='form-group'>
            <span>Email</span>
            {this.renderError('email')}
            <input ref='email' type='email' />
          </div>
          <div className='form-group'>
            <span>Full name</span>
            {this.renderError('name')}
            <input ref='name' type='text' />
          </div>
          <div className='form-group'>
            <span>Password</span>
            {this.renderError('password')}
            <input ref='password' type='password' />
          </div>
          <div className='form-group'>
            <span>Confirm password</span>
            {this.renderError('password-confirmation')}
            <input ref='passwordConfirmation' type='password' />
          </div>
          <button className='button primary no-margin full-width'>Sign up</button>
        </form>
      </div>
    )
  }
}

export default Signup
