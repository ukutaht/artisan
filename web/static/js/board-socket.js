import {Socket} from "phoenix"
import parseStories from './stories/parse'

class BoardSocket {
  constructor(projectId) {
    this.projectId = projectId
  }

  join(callbacks) {
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })
    socket.connect()

    let channel = socket.channel(`boards:${this.projectId}`, {})
    channel.join()

    channel.on("update:story", callbacks.onUpdateStory)
    channel.on("move:story", (updatedColumns) => {
      callbacks.onMoveStory(parseStories(updatedColumns))
    })
  }
}

export default BoardSocket
