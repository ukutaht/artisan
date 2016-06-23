import Api from '../api'

class StoryService {
  update(story, callback) {
    Api.put(`/api/stories/${story.id}`, {story: story}, (err, res) => {
      callback(res.body)
    })
  }

  move(storyId, state, index, callback) {
    let payload = {state: state, index: index}
    Api.post(`/api/stories/${storyId}/move`, payload, (err, res) => {
      callback(res.body)
    })
  }

  add(projectId, story, callback) {
    Api.post(`/api/stories`, {story: story}, (err, res) => {
      callback(res.body)
    })
  }

  del(storyId, callback) {
    Api.del(`/api/stories/${storyId}`, (err, res) => {
      callback(res.body)
    })
  }
}

export default StoryService
