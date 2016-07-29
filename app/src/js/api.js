import Request from 'superagent'
import browserHistory from 'react-router/lib/browserHistory'

import * as users from 'users/service'
import * as notifications from 'notifications/service'

const UNAUTHORIZED = 401
const NOT_FOUND = 404

function handleErrors(err) {
  if (!err.status && !err.response) {
    notifications.error('Could not reach the server. Please check your connection')
  } else if (err.status === UNAUTHORIZED) {
    users.logout()
    browserHistory.push('/login')
  } else if (err.status === NOT_FOUND) {
    browserHistory.push('/404')
  }

  return new Promise((resolve, reject) => reject(err))
}

function getBody(res) { return res.body }

class Api {
  static get(endpoint) {
    return Request.get(endpoint)
    .set('Authorization', `Bearer ${users.token()}`)
    .then(getBody, handleErrors)
  }

  static post(endpoint, payload) {
    return Request.post(endpoint)
    .set('Authorization', `Bearer ${users.token()}`)
    .send(payload)
    .then(getBody, handleErrors)
  }

  static put(endpoint, payload) {
    return Request.put(endpoint)
    .set('Authorization', `Bearer ${users.token()}`)
    .send(payload)
    .then(getBody, handleErrors)
  }

  static del(endpoint) {
    return Request.del(endpoint)
    .set('Authorization', `Bearer ${users.token()}`)
    .then(getBody, handleErrors)
  }
}

export default Api
