import {Socket} from "phoenix"
import parseStories from './stories/parse'

function parseThen(f) {
  return (data) => {
    return f(parseStories(data))
  }
}

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

    channel.on("update:story", parseThen(callbacks.onUpdateStory))
    channel.on("add:story",    parseThen(callbacks.onAddStory))
    channel.on("move:story",   parseThen(callbacks.onMoveStory))
  }
}

export default BoardSocket
