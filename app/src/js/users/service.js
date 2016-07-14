import Api from '../api'

function saveToken(res) {
  localStorage.setItem('token', res.token)
  return res
}

export default class UserService {
  signup(user) {
    return Api.post('/api/users/signup', {user: user}).then(saveToken)
  }

  login(user) {
    return Api.post('/api/users/login', user).then(saveToken)
  }

  logout() {
    localStorage.setItem('token', null)
  }
}
