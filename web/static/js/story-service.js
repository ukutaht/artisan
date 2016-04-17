import API from './api'
import parseStories from './stories/parse'

class StoryService {
  update(story, callback) {
    API.put(`/api/stories/${story.id}`).send({story: story}).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  move(storyId, state, index, callback) {
    API.post(`/api/stories/${storyId}/move`)
           .send({state: state, index: index})
           .end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  add(projectId, story, callback) {
    API.post(`/api/stories`).send({story: story}).end((err, res) => {
      callback(parseStories(res.body))
    })
  }
}

export default StoryService
