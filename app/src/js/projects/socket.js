import {Socket} from 'phoenix-js'

const HOST = 'ws://localhost:4000'

export default class ProjectSocket {
  constructor(projectId) {
    this.projectId = projectId
  }

  join(callbacks) {
    const socket = new Socket(HOST + '/socket', {
      params: {token: localStorage.getItem('token')},
      //logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    socket.connect()

    this.channel = socket.channel(`projects:${this.projectId}`, {})
    this.channel.join()

    this.channel.on('story:update', callbacks.onUpdateStory)
    this.channel.on('story:add',    callbacks.onAddStory)
    this.channel.on('story:move',   callbacks.onMoveStory)
    this.channel.on('story:delete', callbacks.onDeleteStory)
  }

  leave() {
    this.channel.leave()
  }
}
