import React from 'react'
import browserHistory from 'react-router/lib/browserHistory'

import * as users from 'users/service'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }
  }

  getFormData() {
    return {
      email: this.refs.email.value,
      password: this.refs.password.value
    }
  }

  onSubmit(e) {
    e.preventDefault()
    const {location} = this.props

    users.login(this.getFormData()).then(() => {
      if (location.state && location.state.nextPathname) {
        browserHistory.push(location.state.nextPathname)
      } else {
        browserHistory.push('/')
      }
    })
  }

  renderError(name) {
    if (this.state.errors[name]) {
      return <span className="input-error">{this.state.errors[name]}</span>
    }
  }

  render() {
    return (
      <div className="skinny-box">
        <h2>Log into Artisan</h2>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className="form-group">
            <span>Email</span>
            <input ref="email" type="text" autoFocus/>
          </div>
          <div className="form-group">
            <span>Password</span>
            <input ref="password" type="password" />
          </div>
          <button className="button primary no-margin full-width">Log in</button>
        </form>
      </div>
    )
  }
}

export default Login
