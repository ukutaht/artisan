import Immutable from 'immutable'
import Request from 'superagent'

import Project from './project'

function convertProjects(key, val) {
  var isStory = Immutable.Iterable.isKeyed(val) && val.has('id');

  if (Immutable.Iterable.isKeyed(val) && val.has('id')) {
    return new Project(val);
  } else if (Immutable.Iterable.isKeyed(val)) {
    return val.toMap()
  } else {
    return val.toList()
  }
}

class ProjectService {
  create(data, callback) {
    Request.post('/api/projects')
    .send({project: data})
    .end((err, res) => {
      callback(res.body)
    })
  }

  all(callback) {
    Request
    .get('/api/projects')
    .set('Bearer', localStorage.getItem('token'))
    .end((err, res) => {
      callback(Immutable.fromJS(res.body, convertProjects))
    })
  }
}

export default ProjectService
