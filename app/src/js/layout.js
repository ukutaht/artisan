import React from 'react'
import Link from 'react-router/lib/Link'
import browserHistory from 'react-router/lib/browserHistory'

import UserService from 'users/service'
const users = new UserService()

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: null
    }
  }

  componentDidMount() {
    users.loadCurrent()
      .then((user) => {
        this.setState({currentUser: user})
      })
      .catch(() => {
        browserHistory.push('/login')
      })
  }

  logout() {
    users.logout()
    browserHistory.push('/login')
  }

  render() {
    if (!this.state.currentUser) return null

    return (
      <div>
        <nav className="top-nav">
          <div className="top-nav__brand">
            <Link to="/">
              <img src="/assets/images/artisan-logo.png" />
            </Link>
          </div>
          <div className="top-nav__right">
            <div className="dropdown hoverable">
              <span className="top-nav__username">
                {this.state.currentUser.name}
                <i className="ion-chevron-down left-padded-icon" />
              </span>
              <div className="dropdown__content">
                <a onClick={this.logout.bind(this)}>
                  <i className="ion-android-exit right-padded-icon" />
                  Logout
                </a>
                <a>
                  <i className="ion-person right-padded-icon" />
                  Profile
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="container">
          {this.props.children}
        </main>
      </div>
    )
  }
}
