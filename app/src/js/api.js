import Request from 'superagent'
import browserHistory from 'react-router/lib/browserHistory'

const HOST = 'http://localhost:4000'
const UNAUTHORIZED = 401
const NOT_FOUND = 404

function handleErrors(err) {
  if (err.status === UNAUTHORIZED) {
    browserHistory.push('/login')
  } else if (err.status === NOT_FOUND) {
    browserHistory.push('/404')
  }
}

function getBody(res) { return res.body }

class Api {
  static get(endpoint) {
    return Request.get(HOST + endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .then(getBody, handleErrors)
  }

  static post(endpoint, payload) {
    return Request.post(HOST + endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .then(getBody, handleErrors)
  }

  static put(endpoint, payload) {
    return Request.put(HOST + endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .then(getBody, handleErrors)
  }

  static del(endpoint) {
    return Request.del(HOST + endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .then(getBody, handleErrors)
  }
}

export default Api
