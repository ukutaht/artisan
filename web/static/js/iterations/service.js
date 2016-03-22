import Request from 'superagent'

import parseStories from '../stories/parse'

class IterationService {
  current(projectId, callback) {
    Request.get(`/api/projects/${projectId}/iterations/current`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  get(projectId, number, callback) {
    Request.get(`/api/projects/${projectId}/iterations/${number}`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  create(projectId, callback) {
    Request.post(`/api/projects/${projectId}/iterations/create`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  start(iterationId, callback) {
    Request.post(`/api/iterations/${iterationId}/start`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  complete(iterationId, callback) {
    Request.post(`/api/iterations/${iterationId}/complete`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }
}

export default IterationService
