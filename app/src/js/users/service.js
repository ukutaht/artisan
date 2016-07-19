import Api from 'api'

let currentUser = null
const subscribers = []

function saveAuth(res) {
  localStorage.setItem('token', res.token)
  currentUser = res.user
  return res
}

function saveUser(res) {
  currentUser = res
  return res
}

function isLoggedIn() {
  return !!localStorage.getItem('token')
}

export default class UserService {
  signup(user) {
    return Api.post('/api/users/signup', {user: user}).then(saveAuth)
  }

  login(user) {
    return Api.post('/api/users/login', user).then(saveAuth)
  }

  logout() {
    localStorage.setItem('token', null)
    currentUser = null;
  }

  loadCurrent() {
    if (isLoggedIn() && currentUser) {
      return new Promise((resolve) => {
        resolve(currentUser)
      })
    } else if (isLoggedIn()) {
      return Api.get('/api/users/current').then(saveUser)
    } else {
      return new Promise((_resolve, reject) => {
        reject('Not logged in!')
      })
    }
  }

  get current() {
    if (isLoggedIn() && currentUser) {
      return currentUser
    } else {
      throw 'User is either not logged in or loaded'
    }
  }

  updateProfile(attrs) {
    return Api.put('/api/users/current', attrs)
      .then(saveUser)
      .then(this.notifySubscribers.bind(this))
  }

  subscribeToChanges(callback) {
    subscribers.push(callback)
  }

  notifySubscribers() {
    for (const callback of subscribers) {
      callback(currentUser)
    }
  }
}
