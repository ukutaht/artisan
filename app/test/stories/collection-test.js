import * as storyCollection from 'stories/collection'
import * as users from 'users/service'
import * as notifications from 'notifications/service'

describe('Stories collection', () => {
  const currentUser = {id: 1, name: 'User'}
  const someoneElse = {id: 2, name: 'Someone Else'}

  beforeEach(() => {
    spyOn(users, 'current').and.returnValue(currentUser)
  })

  it('adds a story to a column', () => {
    const stories = {backlog: []}
    const story = {state: 'backlog', creator: currentUser}

    const updated = storyCollection.addStory(stories, story)

    expect(updated.backlog[0]).toEqual(story)
  })

  it('notifies of story created when it was created by current user', () => {
    const stories = {backlog: []}
    const story = {state: 'backlog', creator: currentUser}
    spyOn(notifications, 'success')

    storyCollection.addStory(stories, story)

    expect(notifications.success).toHaveBeenCalledWith('Story created')
  })

  it('notifies of story created when it was created by someone else', () => {
    const stories = {backlog: []}
    const story = {state: 'backlog', number: 42, creator: someoneElse}
    spyOn(notifications, 'info')

    storyCollection.addStory(stories, story)

    expect(notifications.info).toHaveBeenCalledWith('Someone Else created story 42')
  })

  it('updates a story in a column', () => {
    const stories = {backlog: [{id: 1, name: 'Old Name'}]}
    const story = {id:1, state: 'backlog', name: 'New Name'}

    const updated = storyCollection.updateStory(stories, {story: story, originator: currentUser})

    expect(updated.backlog[0].name).toEqual('New Name')
  })

  it('notifies of story updated when it was updated by current user', () => {
    const stories = {backlog: [{id: 1, name: 'Old Name'}]}
    const story = {id:1, state: 'backlog', name: 'New Name'}
    spyOn(notifications, 'success')

    const updated = storyCollection.updateStory(stories, {story: story, originator: currentUser})

    expect(notifications.success).toHaveBeenCalledWith('Story updated')
  })

  it('notifies of story updated when it was updated by someone else', () => {
    const stories = {backlog: [{id: 1, name: 'Old Name'}]}
    const story = {id:1, state: 'backlog', number: 42, name: 'New Name'}
    spyOn(notifications, 'info')

    const updated = storyCollection.updateStory(stories, {story: story, originator: someoneElse})

    expect(notifications.info).toHaveBeenCalledWith('Someone Else updated story 42')
  })


  it('moves a story', () => {
    const stories = {backlog: [{id: 1}, {id: 2}], ready: []}
    const story = {id:1}

    const updated = storyCollection.moveStory(stories, {story: story, from: 'backlog', to: 'ready', index: 0, originator: currentUser})

    expect(updated.backlog.length).toEqual(1)
    expect(updated.ready.length).toEqual(1)
    expect(updated.ready[0]).toEqual(story)
  })

  it('notifies of story move when it was moved by current user', () => {
    const stories = {backlog: [{id: 1}, {id: 2}], ready: []}
    const story = {id:1}
    spyOn(notifications, 'success')

    const updated = storyCollection.moveStory(stories, {story: story, from: 'backlog', to: 'ready', index: 0, originator: currentUser})

    expect(notifications.success).toHaveBeenCalledWith('Story position saved')
  })

  it('notifies of story updated when it was updated by someone else', () => {
    const stories = {backlog: [{id: 1}, {id: 2}], ready: []}
    const story = {id: 1, number: 42}
    spyOn(notifications, 'info')

    const updated = storyCollection.moveStory(stories, {story: story, from: 'backlog', to: 'ready', index: 0, originator: someoneElse})

    expect(notifications.info).toHaveBeenCalledWith('Someone Else moved story 42 from backlog to ready')
  })

  it('deletes a story', () => {
    const stories = {backlog: [{id: 1}]}
    const updated = storyCollection.deleteStory(stories, {id: 1, from: 'backlog', number: 42, originator: currentUser})

    expect(updated.backlog.length).toEqual(0)
  })

  it('notifies of story delete when it was deleted by current user', () => {
    const stories = {backlog: [{id: 1}]}
    spyOn(notifications, 'success')

    const updated = storyCollection.deleteStory(stories, {id: 1, from: 'backlog', number: 42, originator: currentUser})

    expect(notifications.success).toHaveBeenCalledWith('Story deleted')
  })

  it('notifies of story delete when it was deleted by someone else', () => {
    const stories = {backlog: [{id: 1}]}
    spyOn(notifications, 'info')

    const updated = storyCollection.deleteStory(stories, {id: 1, from: 'backlog', number: 42, originator: someoneElse})

    expect(notifications.info).toHaveBeenCalledWith('Someone Else deleted story 42')
  })
})
