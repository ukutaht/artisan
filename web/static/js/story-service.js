import Immutable from 'immutable'
import Request from 'superagent'

import Story from './story'

class StoryService {
  getByColumn(callback) {
    Request.get('/api/stories').end((err, res) => {
      let stories = Immutable.List(res.body)
        .map((s) => new Story(s))
        .sortBy((s) => s.position)
        .groupBy((s) => s.state)

      callback(stories)
    })
  }

  update(story, callback) {
    Request.put(`/api/stories/${story.id}`).send({story: story}).end((err, res) => {
      callback(new Story(res.body))
    })
  }

  move(story, state, index, callback) {
    Request.post(`/api/stories/${story.id}/move`)
           .send({state: state, index: index})
           .end((err, res) => {
      callback(new Story(res.body))
    })
  }

  add(story, callback) {
    Request.post('/api/stories').send({story: story}).end((err, res) => {
      callback(new Story(res.body))
    })
  }
}

export default StoryService
