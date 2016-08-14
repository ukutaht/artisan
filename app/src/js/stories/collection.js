import update from 'react/lib/update'
import * as notifications from 'notifications/service'
import * as users from 'users/service'

export function addStory(stories, story) {
  if (story.creator.id === users.current().id) {
    notifications.success('Story created')
  } else {
    notifications.info(`${story.creator.name} created story ${story.number}`)
  }

  return update(stories, {[story.state]: {$unshift: [story]}})
}

export function updateStory(stories, {story, originator}) {
  if (originator.id === users.current().id) {
    notifications.success('Story updated')
  } else {
    notifications.info(`${originator.name} updated story ${story.number}`)
  }

  return update(stories, {[story.state]: {$apply: (column) => {
    const index = column.findIndex(({id}) => id === story.id)
    return update(column, {[index]: {$set: story}})
  }}})
}

export function moveStory(stories, {story, originator, from, to, index}) {
  if (originator.id === users.current().id) {
    notifications.success('Story position saved')
  } else if (from !== to) {
    notifications.info(`${originator.name} moved story ${story.number} from ${from} to ${to}`)
  }

  const removed = update(stories, {[from]: {$apply: (column) => {
    return column.filter((existing) => existing.id !== story.id);
  }}})

  return update(removed, {[to]: {$splice: [[index, 0, story]]}})
}

export function deleteStory(stories, {id, number, from, originator}) {
  if (originator.id === users.current().id) {
    notifications.success('Story deleted')
  } else {
    notifications.info(`${originator.name} deleted story ${number}`)
  }

  return update(stories, {[from]: {$apply: (column) => {
    return column.filter((existing) => existing.id !== id);
  }}})
}
