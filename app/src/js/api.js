import Request from 'superagent'
import browserHistory from 'react-router/lib/browserHistory'

const UNAUTHORIZED = 401
const NOT_FOUND = 404

function handleErrors(err) {
  if (err.status === UNAUTHORIZED) {
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
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .then(getBody, handleErrors)
  }

  static post(endpoint, payload) {
    return Request.post(endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .then(getBody, handleErrors)
  }

  static put(endpoint, payload) {
    return Request.put(endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .then(getBody, handleErrors)
  }

  static del(endpoint) {
    return Request.del(endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .then(getBody, handleErrors)
  }
}

export default Api
