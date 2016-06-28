import Api from '../api'

class StoryService {
  update(story, callback) {
    Api.put(`/api/stories/${story.id}`, {story: story}, (res) => {
      callback(res.body)
    })
  }

  move(storyId, state, index, callback) {
    const payload = {state: state, index: index}
    Api.post(`/api/stories/${storyId}/move`, payload, (res) => {
      callback(res.body)
    })
  }

  add(projectId, story, callback) {
    Api.post('/api/stories', {story: story}, (res) => {
      callback(res.body)
    })
  }

  del(storyId, callback) {
    Api.del(`/api/stories/${storyId}`, (res) => {
      callback(res.body)
    })
  }
}

export default StoryService
