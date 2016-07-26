import Api from 'api'

export function create(data) {
  return Api.post('/api/projects', {project: data})
}

export function all() {
  return Api.get('/api/projects')
}

export function find(id) {
  return Api.get(`/api/projects/${id}`)
}

export function update(id, attrs) {
  return Api.put(`/api/projects/${id}`, {project: attrs})
}

export function addCollaborator(projectId, userId) {
  return Api.post(`/api/projects/${projectId}/collaborators`, {user_id: userId})
}

export function removeCollaborator(projectId, userId) {
  return Api.del(`/api/projects/${projectId}/collaborators/${userId}`)
}

export function autocompleteCollaborators(projectId, query) {
  const q = encodeURIComponent(query)
  return Api.get(`/api/projects/${projectId}/collaborators/autocomplete?q=${q}`)
}
