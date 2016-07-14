import Api from '../api'

class ProjectService {
  create(data, callback) {
    Api.post('/api/projects', {project: data}, (res) => {
      callback(res.body)
    })
  }

  all(callback) {
    Api.get('/api/projects', (res) => {
      callback(res.body)
    })
  }

  find(id, callback) {
    Api.get(`/api/projects/${id}`, (res) => {
      callback(res.body)
    })
  }

  update(project, callback) {
    Api.put(`/api/projects/${project.id}`, {project: project}, (res) => {
      callback(res.body)
    })
  }

  addCollaborator(projectId, userId, callback) {
    Api.post(`/api/projects/${projectId}/collaborators`, {user_id: userId}, () => {
      callback()
    })
  }

  removeCollaborator(projectId, userId, callback) {
    Api.del(`/api/projects/${projectId}/collaborators/${userId}`, () => {
      callback()
    })
  }

  autocompleteCollaborators(projectId, query, callback) {
    const q = encodeURIComponent(query)
    Api.get(`/api/projects/${projectId}/collaborators/autocomplete?q=${q}`, (res) => {
      callback(res.body)
    })
  }
}

export default ProjectService
