import Api from 'api'

export function get(projectId, number) {
  return Api.get(`/api/projects/${projectId}/iterations/${number}`)
}

export function getByStory(projectId, storyNumber) {
  return Api.get(`/api/projects/${projectId}/iterations/by-story/${storyNumber}`)
}

export function create(projectId) {
  return Api.post(`/api/projects/${projectId}/iterations/create`)
}

export function start(iterationId) {
  return Api.post(`/api/iterations/${iterationId}/start`)
}

export function complete(iterationId) {
  return Api.post(`/api/iterations/${iterationId}/complete`)
}
