import Api from '../api'

class ProjectService {
  create(data) {
    return Api.post('/api/projects', {project: data})
  }

  all() {
    return Api.get('/api/projects')
  }

  find(id) {
    return Api.get(`/api/projects/${id}`)
  }

  update(project) {
    return Api.put(`/api/projects/${project.id}`, {project: project})
  }

  addCollaborator(projectId, userId) {
    return Api.post(`/api/projects/${projectId}/collaborators`, {user_id: userId})
  }

  removeCollaborator(projectId, userId) {
    return Api.del(`/api/projects/${projectId}/collaborators/${userId}`)
  }

  autocompleteCollaborators(projectId, query) {
    const q = encodeURIComponent(query)
    return Api.get(`/api/projects/${projectId}/collaborators/autocomplete?q=${q}`)
  }
}

export default ProjectService
