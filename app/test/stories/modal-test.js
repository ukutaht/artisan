import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import StoryModal from 'stories/modal'

describe('StoryModal', () => {
  let view;

  const project = {
    id: 1,
    collaborators: [{id: 1, name: 'User'}]
  }

  const story = {
    name: 'Name',
    acceptance_criteria: 'AC',
    estimate: 2.75,
    optimistic: 1,
    realistic: 2,
    pessimistic: 3,
    tags: [],
    assignee: null,
    creator: {name: 'Creator name'}
  }

  let submit;
  let onClose;
  const fakeSubmitEvent = { preventDefault() {} }

  beforeEach(() => {
    onClose = jasmine.createSpy('onClose')
    submit  = jasmine.createSpy('submit')

    view = TestUtils.renderIntoDocument(<StoryModal
      story={story}
      project={project}
      onSubmit={submit}
      onClose={onClose}
      routeParams={{iterationNumber: 'current'}}/>
    );
  })

  it('closes when user presses escape', () => {
    document.onkeydown({keyCode: 27})

    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when user presses any other character', () => {
    document.onkeydown({keyCode: 13})

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls the onSubmit handler when form is submitted', () => {
    view.handleSubmit(fakeSubmitEvent)

    expect(submit).toHaveBeenCalled()
  })

  it('submits name', () => {
    view.nameChanged({target: {value: 'New Name'}})
    view.handleSubmit(fakeSubmitEvent)

    const submitted = submit.calls.mostRecent().args[0]
    expect(submitted.name).toEqual('New Name')
  })

  it('submits acceptance criteria', () => {
    view.acceptanceCriteriaChanged({target: {value: 'New AC'}})
    view.handleSubmit(fakeSubmitEvent)

    const submitted = submit.calls.mostRecent().args[0]
    expect(submitted.acceptance_criteria).toEqual('New AC')
  })

  it('submits estimates as numbers', () => {
    view.estimateChanged('optimistic')({target: {value: '2'}})
    view.estimateChanged('realistic')({target: {value: '3'}})
    view.estimateChanged('pessimistic')({target: {value: '4'}})

    view.handleSubmit(fakeSubmitEvent)

    const submitted = submit.calls.mostRecent().args[0]
    expect(submitted.optimistic).toEqual(2)
    expect(submitted.realistic).toEqual(3)
    expect(submitted.pessimistic).toEqual(4)
  })

  it('submits null values for empty estimates', () => {
    view.estimateChanged('optimistic')({target: {value: ''}})
    view.estimateChanged('realistic')({target: {value: ''}})
    view.estimateChanged('pessimistic')({target: {value: ''}})

    view.handleSubmit(fakeSubmitEvent)

    const submitted = submit.calls.mostRecent().args[0]
    expect(submitted.optimistic).toBeNull()
    expect(submitted.realistic).toBeNull()
    expect(submitted.pessimistic).toBeNull()
  })

  it('calculates and submits total estimate', () => {
    view.estimateChanged('optimistic')({target: {value: '2'}})
    view.estimateChanged('realistic')({target: {value: '3'}})
    view.estimateChanged('pessimistic')({target: {value: '4'}})

    view.handleSubmit(fakeSubmitEvent)

    const submitted = submit.calls.mostRecent().args[0]
    expect(submitted.estimate).toEqual(3.75)
  })

  it('splits tags before posting to backend', () => {
    view.tagsChanged({target: {value: 'tag1, tag2'}})

    view.handleSubmit(fakeSubmitEvent)

    const submitted = submit.calls.mostRecent().args[0]
    expect(submitted.tags).toEqual(['tag1', 'tag2'])
  })

  it('submits assignee id', () => {
    view.assigneeChanged(1)

    view.handleSubmit(fakeSubmitEvent)

    const submitted = submit.calls.mostRecent().args[0]
    expect(submitted.assignee_id).toEqual(1)
  })

  it('only submits data that has been changed', () => {
    view.estimateChanged('pessimistic')({target: {value: '3'}})

    view.handleSubmit(fakeSubmitEvent)

    const submitted = submit.calls.mostRecent().args[0]
    expect(submitted.acceptance_criteria).toBeUndefined()
    expect(submitted.assignee_id).toBeUndefined()
  })
})
