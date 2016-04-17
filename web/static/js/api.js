import Request from 'superagent'

class Api {
  static get(endpoint) {
    return Request.get(endpoint)
                  .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }

  static post(endpoint) {
    return Request.post(endpoint)
                  .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }

  static put(endpoint) {
    return Request.put(endpoint)
                  .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }
}

export default Api
