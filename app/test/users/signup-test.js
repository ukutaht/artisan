import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import fakePromise from 'helpers/fake-promise'
import * as users from 'users/service'
import Signup from 'users/signup'

describe('Invite', () => {
  let signup;
  const token = 'token';
  const fakeSubmit = {preventDefault: () => {}}

  beforeEach(() => {
    const location = {query: {token: token}}
    spyOn(users, 'signup').and.callFake(fakePromise.resolve())
    signup = TestUtils.renderIntoDocument(<Signup location={location}/>)
    signup.change('email', {target: {value: 'user@email.com'}})
    signup.change('name',  {target: {value: 'User Name'}})
    signup.change('password', {target: {value: 'password'}})
    signup.change('passwordConfirmation', {target: {value: 'password'}})
  })

  it('successfully signs up user', () => {
    signup.onSubmit(fakeSubmit)

    expect(users.signup).toHaveBeenCalledWith({
      email: 'user@email.com',
      name: 'User Name',
      password: 'password',
      passwordConfirmation: 'password'
    }, token)

  })

  it('validates that email is filled in on submit', () => {
    signup.change('email', {target: {value: ''}})
    signup.onSubmit(fakeSubmit)

    expect(signup.state.formErrors.email).toEqual('Cannot be blank')
    expect(users.signup).not.toHaveBeenCalled()
  })

  it('validates that name is filled in on submit', () => {
    signup.change('name', {target: {value: ''}})
    signup.onSubmit(fakeSubmit)

    expect(signup.state.formErrors.name).toEqual('Cannot be blank')
    expect(users.signup).not.toHaveBeenCalled()
  })

  it('validates that password is at least 6 characters long', () => {
    signup.change('password', {target: {value: '123'}})
    signup.onSubmit(fakeSubmit)

    expect(signup.state.formErrors.password).toEqual('Must be at least 6 characters long')
    expect(users.signup).not.toHaveBeenCalled()
  })

  it('validates that password matches confirmation', () => {
    signup.change('password', {target: {value: '123456'}})
    signup.change('passwordConfirmation', {target: {value: '654321'}})
    signup.onSubmit(fakeSubmit)

    expect(signup.state.formErrors.passwordConfirmation).toEqual('Must match the password')
    expect(users.signup).not.toHaveBeenCalled()
  })

  it('shows form errors from api when response in 400', () => {
    const res = {status: 400, response: {body: {errors: {email: 'already taken'}}}}
    users.signup.and.callFake(fakePromise.reject(res))
    signup.onSubmit(fakeSubmit)

    expect(signup.state.formErrors.email).toEqual('already taken')
  })

  it('shows token error when response is 403', () => {
    const res = {status: 403, response: {text: "Invalid token"}}
    users.signup.and.callFake(fakePromise.reject(res))
    signup.onSubmit(fakeSubmit)

    expect(signup.state.tokenError).toEqual('Invalid token')
  })
})
