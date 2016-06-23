import Api from '../api'

class IterationService {
  current(projectId, callback) {
    Api.get(`/api/projects/${projectId}/iterations/current`, (err, res) => {
      callback(res.body)
    })
  }

  get(projectId, number, callback) {
    Api.get(`/api/projects/${projectId}/iterations/${number}`, (err, res) => {
      callback(res.body)
    })
  }

  create(projectId, callback) {
    Api.post(`/api/projects/${projectId}/iterations/create`, null, (err, res) => {
      callback(res.body)
    })
  }

  start(iterationId, callback) {
    Api.post(`/api/iterations/${iterationId}/start`, null, (err, res) => {
      callback(res.body)
    })
  }

  complete(iterationId, callback) {
    Api.post(`/api/iterations/${iterationId}/complete`, null, (err, res) => {
      callback(res.body)
    })
  }
}

export default IterationService
