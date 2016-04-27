import Request from 'superagent'

const HOST = "http://localhost:4000"
const UNAUTHORIZED = 401

function ensureAuthorized(f) {
  return (err, res) => {
    if (err && err.status == UNAUTHORIZED) {
      location.href = "/login"
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
}

export default Api
