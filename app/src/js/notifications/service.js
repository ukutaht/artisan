const DEFAULT_TIMEOUT = 2500
let subscriber = () => {}

export function subscribe(fn) {
  subscriber = fn
}

export function info(text, timeout) {
  subscriber({
    type: 'info',
    text: text,
    timeout: timeout || DEFAULT_TIMEOUT
  })
}

export function error(text, timeout) {
  subscriber({
    type: 'error',
    text: text,
    timeout: timeout || DEFAULT_TIMEOUT
  })
}
