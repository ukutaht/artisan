import API from '../api'
import parseStories from '../stories/parse'

class IterationService {
  current(projectId, callback) {
    API.get(`/api/projects/${projectId}/iterations/current`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  get(projectId, number, callback) {
    API.get(`/api/projects/${projectId}/iterations/${number}`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  create(projectId, callback) {
    API.post(`/api/projects/${projectId}/iterations/create`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  start(iterationId, callback) {
    API.post(`/api/iterations/${iterationId}/start`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }

  complete(iterationId, callback) {
    API.post(`/api/iterations/${iterationId}/complete`).end((err, res) => {
      callback(parseStories(res.body))
    })
  }
}

export default IterationService
