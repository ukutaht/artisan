import Request from 'superagent'

class Api {
  static get(endpoint, callback) {
    return Request.get(endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .end(callback)
  }

  static post(endpoint, payload, callback) {
    return Request.post(endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .end(callback)
  }

  static put(endpoint, payload, callback) {
    return Request.put(endpoint)
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    .send(payload)
    .end(callback)
  }
}

export default Api
