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
}

export default ProjectService