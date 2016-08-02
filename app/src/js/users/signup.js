import React from 'react'
import Link from 'react-router/lib/Link'
import browserHistory from 'react-router/lib/browserHistory'

import * as users from 'users/service'
import InputWithError from 'forms/input-with-error'

class Signup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      form: {
        email: '',
        name: '',
        password: '',
        passwordConfirmation: ''
      }
    }
  }

  validate() {
    const errors = {}
    const {form} = this.state

    if (form.name === '') {
      errors['name'] = 'Cannot be blank'
    }
    if (form.email === '') {
      errors['email'] = 'Cannot be blank'
    }
    if (form.password.length < 6) {
      errors['password'] = 'Must be at least 6 characters long'
    }
    if (form.password !== form.passwordConfirmation) {
      errors['passwordConfirmation'] = 'Must match the password'
    }

    return errors
  }

  onSubmit(e) {
    e.preventDefault()

    const errors = this.validate()
    if (Object.keys(errors).length > 0) {
      this.setState({
        errors: errors
      })
    } else {
      this.setState({errors: {}})

      users.signup(this.state.form).then(() => {
        browserHistory.push('/')
      }).catch((e) => {
        this.setState({
          errors: e.response.body.errors
        })
      })
    }
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
        <form noValidate={true} onSubmit={this.onSubmit.bind(this)}>
          <div className='form-group'>
            <InputWithError error={this.state.errors['email']} value={this.state.form.email} onChange={this.change.bind(this, 'email')} type='email' placeholder="Email"/>
          </div>
          <div className='form-group'>
            <InputWithError error={this.state.errors['name']} value={this.state.form.name} onChange={this.change.bind(this, 'name')} type='text' placeholder="Full name" />
          </div>
          <div className='form-group'>
            <InputWithError error={this.state.errors['password']} value={this.state.form.password} onChange={this.change.bind(this, 'password')} type='password' placeholder="Password" />
          </div>
          <div className='form-group'>
            <InputWithError error={this.state.errors['passwordConfirmation']} value={this.state.form.passwordConfirmation} onChange={this.change.bind(this, 'passwordConfirmation')} type='password' placeholder="Confirm password" />
          </div>
          <button className='button primary no-margin full-width'>Sign up</button>
        </form>
      </div>
    )
  }
}

export default Signup
