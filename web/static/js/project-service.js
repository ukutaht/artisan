import Request from 'superagent'

class ProjectService {
  create(data, callback) {
    Request.post('/api/projects')
    .send({project: data})
    .end((err, res) => {
      callback(res.body)
    })
  }
}

export default ProjectService
