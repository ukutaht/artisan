import Request from 'superagent'

class UserService {
  signup(user, callback) {
    Request.post('/api/users').send(user).end((err, res) => {
      callback(res.body)
    })
  }
}

export default UserService
