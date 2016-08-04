import React from 'react'
import Link from 'react-router/lib/Link'
import browserHistory from 'react-router/lib/browserHistory'

import Avatar from 'users/avatar'
import Invite from 'users/invite'
import Notifications from 'notifications/notifications'

import * as users from 'users/service'

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: users.current(),
      inviteOpen: false
    }
  }

  componentDidMount() {
    users.subscribeToChanges((updated) => {
      this.setState({currentUser: updated})
    })
  }

  logout() {
    users.logout()
    browserHistory.push('/login')
  }

  openInvite() {
    this.setState({inviteOpen: true})
  }

  closeInvite() {
    this.setState({inviteOpen: false})
  }

  renderInviteModal() {
    if (this.state.inviteOpen) {
      return <Invite onClose={this.closeInvite.bind(this)}/>
    }
    return false
  }

  render() {
    return (
      <div>
        <Notifications />
        {this.renderInviteModal()}
        <nav className="top-nav">
          <div className="container">
            <div className="top-nav__brand">
              <Link to="/">
                <img src="/images/artisan-logo.png" />
              </Link>
              <a className="invite-link clickable" onClick={this.openInvite.bind(this)}>Invite</a>
            </div>
            <div className="top-nav__right">
              <div className="dropdown hoverable">
                <span className="top-nav__username">
                  <Avatar src={this.state.currentUser.avatar} size={30} />
                  {this.state.currentUser.name}
                  <i className="ion-chevron-down left-padded-icon" />
                </span>
                <div className="dropdown__content space-top-tiny">
                  <Link to="/profile">
                    <i className="ion-person right-padded-icon" />
                    Profile
                  </Link>
                  <a onClick={this.logout.bind(this)}>
                    <i className="ion-android-exit right-padded-icon" />
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="container">
          {this.props.children}
        </main>

        <footer>
          Copyright {(new Date()).getFullYear()} © 8th Light, Inc
        </footer>
      </div>
    )
  }
}
