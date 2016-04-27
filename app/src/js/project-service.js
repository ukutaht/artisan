import Immutable from 'immutable'

import Project from './project'
import Api from './api'

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
    Api.post('/api/projects', {project: data}, (err, res) => {
      callback(res.body)
    })
  }

  all(callback) {
    Api.get('/api/projects', (err, res) => {
      callback(Immutable.fromJS(res.body, convertProjects))
    })
  }
}

export default ProjectService
