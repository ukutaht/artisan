import {Socket} from 'phoenix-js'

const HOST = 'ws://localhost:4000'

class BoardSocket {
  constructor(projectId) {
    this.projectId = projectId
  }

  join(callbacks) {
    const socket = new Socket(HOST + '/socket')
    socket.connect()

    const channel = socket.channel(`boards:${this.projectId}`, {})
    channel.join()

    channel.on('update:story', callbacks.onUpdateStory)
    channel.on('add:story',    callbacks.onAddStory)
    channel.on('move:story',   callbacks.onMoveStory)
  }
}

export default BoardSocket
