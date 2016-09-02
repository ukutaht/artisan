import React from 'react'
import Link from 'react-router/lib/Link'
import browserHistory from 'react-router/lib/browserHistory'

import * as users from 'users/service'

class Login extends React.Component {
  componentWillMount() {
    document.title = 'Artisan | Log in'

    this.setState({loginError: false})
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
    this.setState({loginError: false})

    users.login(this.getFormData()).then(() => {
      if (location.state && location.state.nextPathname) {
        browserHistory.push(location.state.nextPathname)
      } else {
        browserHistory.push('/')
      }
    }).catch(() => {
      this.setState({loginError: true})
    })
  }

  renderError() {
    if (this.state.loginError) {
      return (
        <div className="error-box">
          The email and password does not match any of our records. Please try again.
        </div>
      )
    }
    return false;
  }

  render() {
    return (
      <div className="skinny-box">
        <div className="login-header">
          <h2 className="space-bottom-tiny">Log into Artisan</h2>
          <p className="space-top-tiny">Or <Link className="blue" to="/signup">sign up</Link> instead</p>
        </div>
        {this.renderError()}
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className="form-group">
            <div className="input-with-icon">
              <input ref="email" type="email" placeholder="Email" tabIndex="1" />
              <i className="ion-person light" />
            </div>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <input ref="password" type="password" placeholder="Password" tabIndex="2"/>
              <i className="ion-locked light" />
            </div>
          </div>
          <button className="button primary no-margin full-width">Log in</button>
        </form>
      </div>
    )
  }
}

export default Login
