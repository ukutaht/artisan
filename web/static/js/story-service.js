import Immutable from 'immutable'
import Request from 'superagent'

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

class StoryService {
  getByColumn(callback) {
    Request.get('/api/stories/by-state').end((err, res) => {
      callback(Immutable.fromJS(res.body, convertStories))
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
