import Api from 'api'

class StoryService {
  update(story) {
    return Api.put(`/api/stories/${story.id}`, {story: story})
  }

  move(storyId, state, index) {
    return Api.post(`/api/stories/${storyId}/move`, {state: state, index: index})
  }

  add(projectId, story) {
    return Api.post('/api/stories', {story: story})
  }

  del(storyId) {
    return Api.del(`/api/stories/${storyId}`)
  }
}

export default StoryService
