import Request from 'superagent'

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
    return Request.get(endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .end(ensureAuthorized(callback))
  }

  static post(endpoint, payload, callback) {
    return Request.post(endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .end(ensureAuthorized(callback))
  }

  static put(endpoint, payload, callback) {
    return Request.put(endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .end(ensureAuthorized(callback))
  }
}

export default Api
