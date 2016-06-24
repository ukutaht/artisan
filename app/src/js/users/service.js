import Api from '../api'

class UserService {
  signup(user, callback) {
    Api.post('/api/users/signup').send(user).end((err, res) => {
      if (!err) {
        localStorage.setItem('token', res.body.token)
        callback(res.body)
      }
    })
  }

  login(user, callback) {
    Api.post('/api/users/login').send(user).end((err, res) => {
      if (!err) {
        localStorage.setItem('token', res.body.token)
        callback(res.body)
      }
    })
  }

  logout() {
    localStorage.setItem('token', null)
  }
}

export default UserService