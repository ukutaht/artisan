import React from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import * as notifications from 'notifications/service'

function values(object) {
  return Object.keys(object).map((key) => object[key]);
}

export default class Notifications extends React.Component {
  componentWillMount() {
    this.setState({notifications: []})

    notifications.subscribe(this.addNotification.bind(this))
  }

  addNotification(notification) {
    this.setState({
      notifications: Object.assign({}, this.state.notifications, {[notification.id]: notification})
    })

    window.setTimeout(() => {
      this.removeNotification(notification.id)
    }, notification.timeout)
  }

  removeNotification(id) {
    const clone = Object.assign({}, this.state.notifications);
    delete clone[id]
    this.setState({notifications: clone});
  }

  renderNotification(notification) {
    return (
      <li key={notification.id} className={`notifications-list__item ${notification.type}`}>
        {notification.text}
        <i className="ion-close" onClick={this.removeNotification.bind(this, notification.id)} />
      </li>
    )
  }

  render() {
    return (
      <ul className="notifications-list">
        <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {values(this.state.notifications).map(this.renderNotification.bind(this))}
        </ReactCSSTransitionGroup>
      </ul>
    )
  }
}
