import Immutable from 'immutable'

import Story from './story'
import Iteration from '../iteration'

function convertStories(key, val) {
  var isStory = Immutable.Iterable.isKeyed(val) && val.has('id');

  if (Immutable.Iterable.isKeyed(val) && val.has('optimistic')) {
    return new Story(val);
  } else if (Immutable.Iterable.isKeyed(val) && val.has('id')) {
    return new Iteration(val)
  } else if (Immutable.Iterable.isKeyed(val)) {
    return val.toMap()
  } else {
    return val.toList()
  }
}

function parse(data) {
  return Immutable.fromJS(data, convertStories)
}

export default parse
