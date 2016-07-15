import Api from 'api'

export default class IterationService {
  current(projectId) {
    return Api.get(`/api/projects/${projectId}/iterations/current`)
  }

  get(projectId, number) {
    return Api.get(`/api/projects/${projectId}/iterations/${number}`)
  }

  create(projectId) {
    return Api.post(`/api/projects/${projectId}/iterations/create`)
  }

  start(iterationId) {
    return Api.post(`/api/iterations/${iterationId}/start`)
  }

  complete(iterationId) {
    return Api.post(`/api/iterations/${iterationId}/complete`)
  }
}
