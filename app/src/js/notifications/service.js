let subscriber = () => {}

export function subscribe(fn) {
  subscriber = fn
}

export function info(text, timeout) {
  subscriber({
    type: 'info',
    text: text,
    timeout: timeout || 2500
  })
}

export function error(text, timeout) {
  subscriber({
    type: 'error',
    text: text,
    timeout: timeout || 2500
  })
}
