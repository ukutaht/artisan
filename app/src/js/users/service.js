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

export function requireAuth(nextState, replace, callback) {
  tryAuth(() => {
    callback()
  }, () => {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
    callback()
  })
}

export function redirectAuth(_, replace, callback) {
  tryAuth(() => {
    replace('/')
    callback()
  }, () => {
    callback()
  })
}

function tryAuth(onSuccess, onFailure) {
  if (isLoggedIn() && currentUser) {
    onSuccess()
  } else if (isLoggedIn()) {
    Api.get('/api/users/current')
      .then(saveUser)
      .then(onSuccess)
      .catch(onFailure)
  } else {
    onFailure()
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
