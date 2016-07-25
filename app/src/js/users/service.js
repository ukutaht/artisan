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

export function signup(user) {
  return Api.post('/api/users/signup', {user: user}).then(saveAuth)
}

export function login(user) {
  return Api.post('/api/users/login', user).then(saveAuth)
}

export function logout() {
  localStorage.removeItem('token')
  currentUser = null;
}

export function loadCurrent() {
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

export function current() {
  if (isLoggedIn() && currentUser) {
    return currentUser
  }
  return null
}

export function token() {
  return localStorage.getItem('token')
}

export function updateProfile(attrs) {
  return Api.put('/api/users/current', attrs)
    .then(saveUser)
    .then(this.notifySubscribers.bind(this))
}

export function subscribeToChanges(callback) {
  subscribers.push(callback)
}

export function notifySubscribers() {
  for (const callback of subscribers) {
    callback(currentUser)
  }
}
