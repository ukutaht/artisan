import Immutable from 'immutable'
import Request from 'superagent'

import parseStories from './stories/parse'

class StoryService {
  getByColumn(projectId, callback) {
    Request.get(`/api/projects/${projectId}/iterations/current`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  update(story, callback) {
    Request.put(`/api/stories/${story.id}`).send({story: story}).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  move(storyId, state, index, callback) {
    Request.post(`/api/stories/${storyId}/move`)
           .send({state: state, index: index})
           .end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  add(projectId, story, callback) {
    Request.post(`/api/stories`).send({story: story}).end((err, res) => {
      callback(parseStories(res.body))
    })
  }
}

export default StoryService
