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

    const channel = socket.channel(`boards:${this.projectId}`, {})
    channel.join()

    channel.on('story:update', callbacks.onUpdateStory)
    channel.on('story:add',    callbacks.onAddStory)
    channel.on('story:move',   callbacks.onMoveStory)
    channel.on('story:delete', callbacks.onDeleteStory)
  }
}

export default BoardSocket
