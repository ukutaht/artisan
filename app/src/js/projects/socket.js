import {Socket} from 'phoenix-socket'
import * as users from 'users/service'

export default class ProjectSocket {
  constructor(projectId, callbacks) {
    this.projectId = projectId
    this.callbacks = callbacks
    this.closeTimeout = null

    this.socket = new Socket('/socket', {
      params: {token: users.token()},
      //logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }),
      timeout: 5000,
      heartbeatIntervalMs: 5000
    })
  }

  join() {
    this.socket.connect();
    window.addEventListener('offline', this.callbacks.connectionDropped)
    window.addEventListener('online', this.onlineCheck.bind(this))

    this.socket.onOpen(this.closeOnSilentHeartbeat.bind(this))
    this.socket.onClose(this.callbacks.connectionDropped)

    this.channel = this.socket.channel(`projects:${this.projectId}`, {})
    this.channel.on('story:update', this.callbacks.onUpdateStory)
    this.channel.on('story:add',    this.callbacks.onAddStory)
    this.channel.on('story:move',   this.callbacks.onMoveStory)
    this.channel.on('story:delete', this.callbacks.onDeleteStory)
    this.channel.join().receive('ok', this.callbacks.connectionAlive)
  }

  closeOnSilentHeartbeat() {
    const timeout = this.socket.heartbeatIntervalMs + this.socket.timeout;
    window.clearTimeout(this.closeTimeout)

    this.closeTimeout = window.setTimeout(this.callbacks.connectionDropped, timeout)
    this.socket.onMessage(() => {
      if (this.channel.canPush()) this.callbacks.connectionAlive()

      window.clearTimeout(this.closeTimeout)
      this.closeTimeout = window.setTimeout(this.callbacks.connectionDropped, timeout)
    })
  }

  onlineCheck() {
    if (!this.channel.canPush()) {
      this.socket.disconnect()
      this.socket.connect()
    }
  }

  addStory(story) {
    return this._push('story:add', story)
  }

  updateStory(id, story) {
    return this._push('story:update', {id: id, story: story})
  }

  moveStory(id, state, index) {
    return this._push('story:move', {id: id, state: state, index: index})
  }

  deleteStory(id) {
    return this._push('story:delete', {id: id})
  }

  leave() {
    this.channel.leave()
    this.socket.disconnect()
  }

  _push(event, data) {
    return new Promise((resolve, reject) => {
      this.channel.push(event, data)
        .receive('ok', resolve)
        .receive('error', reject)
        .receive('timeout', () => {
          this.callbacks.connectionDropped()
          reject()
        })
    })
  }
}
