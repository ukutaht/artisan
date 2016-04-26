import Api from './api'
import parseStories from './stories/parse'

class StoryService {
  update(story, callback) {
    Api.put(`/api/stories/${story.id}`, {story: story}, (err, res) => {
      callback(parseStories(res.body))
    })
  }

  move(storyId, state, index, callback) {
    let payload = {state: state, index: index}
    Api.post(`/api/stories/${storyId}/move`, payload, (err, res) => {
      callback(parseStories(res.body))
    })
  }

  add(projectId, story, callback) {
    Api.post(`/api/stories`, {story: story}, (err, res) => {
      callback(parseStories(res.body))
    })
  }
}

export default StoryService
