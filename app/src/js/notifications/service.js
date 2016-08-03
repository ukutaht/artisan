const DEFAULT_TIMEOUT = 2500
let nextId = 0
let subscriber = () => {}

function sendNotification(type, text, timeout) {
  subscriber({
    type: type,
    text: text,
    timeout: timeout || DEFAULT_TIMEOUT,
    id: nextId++
  })
}

export function subscribe(fn) {
  subscriber = fn
}

export function info(text, timeout) {
  sendNotification('info', text, timeout)
}

export function success(text, timeout) {
  sendNotification('success', text, timeout)
}

export function error(text, timeout) {
  sendNotification('error', text, timeout)
}
