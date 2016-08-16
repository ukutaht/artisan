import {Socket} from 'phoenix-socket'
import * as users from 'users/service'

function promisify(pushEvent) {
  return new Promise((resolve, reject) => {
    pushEvent
      .receive('ok', resolve)
      .receive('error', reject)
  })
}

export default class ProjectSocket {
  constructor(projectId) {
    this.projectId = projectId
  }

  join(callbacks) {
    const socket = new Socket('/socket', {
      params: {token: users.token()},
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    socket.connect()

    this.channel = socket.channel(`projects:${this.projectId}`, {})
    this.channel.join()

    this.channel.on('story:update', callbacks.onUpdateStory)
    this.channel.on('story:add',    callbacks.onAddStory)
    this.channel.on('story:move',   callbacks.onMoveStory)
    this.channel.on('story:delete', callbacks.onDeleteStory)
  }

  addStory(story) {
    return promisify(this.channel.push('story:add', story))
  }

  updateStory(id, story) {
    return promisify(this.channel.push('story:update', {id: id, story: story}))
  }

  moveStory(id, state, index) {
    return promisify(
      this.channel.push('story:move', {id: id, state: state, index: index})
    )
  }

  deleteStory(id) {
    return promisify(this.channel.push('story:delete', {id: id}))
  }

  leave() {
    this.channel.leave()
  }
}
