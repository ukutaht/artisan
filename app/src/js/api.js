import Request from 'superagent'
import browserHistory from 'react-router/lib/browserHistory'

const HOST = "http://localhost:4000"
const UNAUTHORIZED = 401
const NOT_FOUND = 404

function ensureAuthorized(f) {
  return (err, res) => {
    if (err && err.status == UNAUTHORIZED) {
      browserHistory.push("/login")
    } else if (err && err.status == NOT_FOUND) {
      browserHistory.push("/404")
    } else {
      f(err, res)
    }
  }
}

class Api {
  static get(endpoint, callback) {
    return Request.get(HOST + endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .end(ensureAuthorized(callback))
  }

  static post(endpoint, payload, callback) {
    return Request.post(HOST + endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .end(ensureAuthorized(callback))
  }

  static put(endpoint, payload, callback) {
    return Request.put(HOST + endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .end(ensureAuthorized(callback))
  }

  static del(endpoint, callback) {
    return Request.del(HOST + endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .end(ensureAuthorized(callback))
  }
}

export default Api
