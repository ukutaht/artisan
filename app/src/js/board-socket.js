import {Socket} from 'phoenix-js'

const HOST = 'ws://localhost:4000'

class BoardSocket {
  constructor(projectId) {
    this.projectId = projectId
  }

  join(callbacks) {
    const socket = new Socket(HOST + '/socket', {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    socket.connect({token: localStorage.getItem('token')})

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

export default BoardSocket
