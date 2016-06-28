import Api from '../api'

class ProjectService {
  create(data, callback) {
    Api.post('/api/projects', {project: data}, (err, res) => {
      callback(res.body)
    })
  }

  all(callback) {
    Api.get('/api/projects', (err, res) => {
      callback(res.body)
    })
  }

  find(id, callback) {
    Api.get(`/api/projects/${id}`, (err, res) => {
      callback(res.body)
    })
  }

  update(project, callback) {
    Api.put(`/api/projects/${project.id}`, {project: project}, (err, res) => {
      callback(res.body)
    })
  }

  collaborators(id, callback) {
    Api.get(`/api/projects/${id}/collaborators`, (err, res) => {
      callback(res.body)
    })
  }

  addCollaborator(projectId, userId, callback) {
    Api.post(`/api/projects/${projectId}/collaborators`, {user_id: userId}, (err, res) => {
      if (!err) {
        callback()
      }
    })
  }

  removeCollaborator(projectId, userId, callback) {
    Api.del(`/api/projects/${projectId}/collaborators/${userId}`, (err, res) => {
      if (!err) {
        callback()
      }
    })
  }

  autocompleteCollaborators(projectId, query, callback) {
    const q = encodeURIComponent(query)
    Api.get(`/api/projects/${projectId}/collaborators/autocomplete?q=${q}`, (err, res) => {
      callback(res.body)
    })
  }
}

export default ProjectService
