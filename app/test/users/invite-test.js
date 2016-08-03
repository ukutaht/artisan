import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import fakePromise from 'helpers/fake-promise'
import * as projects from 'projects/service'
import * as users from 'users/service'
import * as notifications from 'notifications/service'
import Invite from 'users/invite'

describe('Invite', () => {
  const projectData = [{id: 1, name: 'Project'}]
  let invite;
  let onClose;
  const fakeSubmit = {preventDefault: () => {}}

  beforeEach(() => {
    onClose = jasmine.createSpy('onClose')
    spyOn(notifications, 'error')
    spyOn(notifications, 'success')
    spyOn(projects, 'all').and.callFake(fakePromise.resolve(projectData))
    spyOn(users, 'invite').and.callFake(fakePromise.resolve(null))

    invite = TestUtils.renderIntoDocument(<Invite onClose={onClose} />)
  })

  it('submits email and project', () => {
    invite.projectChanged(1)
    invite.emailChanged({target: {value: 'user@email.com'}})
    invite.handleSubmit(fakeSubmit)

    expect(users.invite).toHaveBeenCalledWith('user@email.com', 1)
  })

  it('notifies of successful invite', () => {
    invite.projectChanged(1)
    invite.emailChanged({target: {value: 'user@email.com'}})
    invite.handleSubmit(fakeSubmit)

    expect(notifications.success).toHaveBeenCalledWith('Invite email sent to user@email.com')
  })

  it('closes afte successful invite', () => {
    invite.projectChanged(1)
    invite.emailChanged({target: {value: 'user@email.com'}})
    invite.handleSubmit(fakeSubmit)

    expect(onClose).toHaveBeenCalled()
  })

  it('ensures that email is filled in', () => {
    invite.emailChanged({target: {value: ''}})
    invite.handleSubmit(fakeSubmit)

    expect(users.invite).not.toHaveBeenCalled()
    expect(invite.state.error).not.toBeNull()
  })

  it('notifies when user is already signed up', () => {
    users.invite.and.callFake(fakePromise.reject({status: 400}))
    invite.emailChanged({target: {value: 'user@email.com'}})
    invite.handleSubmit(fakeSubmit)

    expect(notifications.error).toHaveBeenCalledWith('user@email.com is already signed up')
  })

})
