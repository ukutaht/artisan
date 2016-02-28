import {Socket} from "phoenix"
import Immutable from 'immutable'
import Story from './stories/story'

function convertStories(key, val) {
  var isStory = Immutable.Iterable.isKeyed(val) && val.has('id');

  if (Immutable.Iterable.isKeyed(val) && val.has('id')) {
    return new Story(val);
  } else if (Immutable.Iterable.isKeyed(val)) {
    return val.toMap()
  } else {
    return val.toList()
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

    channel.on("update:story", callbacks.onUpdateStory)
    channel.on("move:story", (updatedColumns) => {
      callbacks.onMoveStory(Immutable.fromJS(updatedColumns, convertStories))
    })
  }
}

export default BoardSocket
