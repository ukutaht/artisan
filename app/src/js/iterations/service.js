import Api from '../api'

class IterationService {
  current(projectId, callback) {
    Api.get(`/api/projects/${projectId}/iterations/current`, (res) => {
      callback(res.body)
    })
  }

  get(projectId, number, callback) {
    Api.get(`/api/projects/${projectId}/iterations/${number}`, (res) => {
      callback(res.body)
    })
  }

  create(projectId, callback) {
    Api.post(`/api/projects/${projectId}/iterations/create`, null, (res) => {
      callback(res.body)
    })
  }

  start(iterationId, callback) {
    Api.post(`/api/iterations/${iterationId}/start`, null, (res) => {
      callback(res.body)
    })
  }

  complete(iterationId, callback) {
    Api.post(`/api/iterations/${iterationId}/complete`, null, (res) => {
      callback(res.body)
    })
  }
}

export default IterationService
