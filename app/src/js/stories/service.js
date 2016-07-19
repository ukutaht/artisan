import Api from 'api'

export function update(story) {
  return Api.put(`/api/stories/${story.id}`, {story: story})
}

export function move(storyId, state, index) {
  return Api.post(`/api/stories/${storyId}/move`, {state: state, index: index})
}

export function add(story) {
  return Api.post('/api/stories', {story: story})
}

export function del(storyId) {
  return Api.del(`/api/stories/${storyId}`)
}
