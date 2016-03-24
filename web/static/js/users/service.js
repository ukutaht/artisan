import Request from 'superagent'

class UserService {
  signup(user, callback) {
    Request.post('/api/users/signup').send(user).end((err, res) => {
      if (!err) {
        localStorage.setItem('token', res.body.token)
        callback(res.body)
      }
    })
  }

  login(user, callback) {
    Request.post('/api/users/login').send(user).end((err, res) => {
      if (!err) {
        localStorage.setItem('token', res.body.token)
        callback(res.body)
      }
    })
  }
}

export default UserService
