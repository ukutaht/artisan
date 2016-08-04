import Api from 'api'
import fakePromise from 'helpers/fake-promise'
import * as users from 'users/service'

describe('Users service', () => {
  const loginSuccess = {
    token: 'token',
    user: {
      name: 'User name'
    }
  }

  it('logs user in', () => {
    spyOn(Api, 'post').and.callFake(fakePromise.resolve(loginSuccess))

    users.login()
    expect(users.current().name).toEqual('User name')
    expect(users.token()).toEqual('token')
  })

  it('logs user out', () => {
    spyOn(Api, 'post').and.callFake(fakePromise.resolve(loginSuccess))

    users.logout()
    expect(users.current()).toBeNull()
    expect(users.token()).toBeNull()
  })

  describe('requireAuth', () => {
    const nextState = {location: {pathname: 'next'}}
    let replace, callback;

    beforeEach(() => {
      replace = jasmine.createSpy('replace')
      callback = jasmine.createSpy('replace')
    })

    it('lets user through if they are logged in', () => {
      spyOn(Api, 'post').and.callFake(fakePromise.resolve(loginSuccess))
      users.login()

      users.requireAuth(nextState, replace, callback)

      expect(replace).not.toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
    })

    it('replaces url if user is not logged in', () => {
      users.logout()

      users.requireAuth(nextState, replace, callback)

      expect(replace).toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
    })

    it('rememebers the url that the logged out users wanted to visit', () => {
      users.logout()

      users.requireAuth(nextState, replace, callback)

      expect(replace.calls.mostRecent().args[0]).toEqual({
        pathname: '/login',
        state: {nextPathname: 'next'}
      })
    })
  })

  describe('redirectAuth', () => {
    let replace, callback;

    beforeEach(() => {
      replace = jasmine.createSpy('replace')
      callback = jasmine.createSpy('replace')
    })

    it('lets logged out users through', () => {
      users.logout()

      users.redirectAuth({}, replace, callback)

      expect(replace).not.toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
    })

    it('redirects logged in users to dashboard', () => {
      spyOn(Api, 'post').and.callFake(fakePromise.resolve(loginSuccess))
      users.login()

      users.redirectAuth({}, replace, callback)

      expect(replace).toHaveBeenCalledWith('/')
      expect(callback).toHaveBeenCalled()
    })
  })
})
