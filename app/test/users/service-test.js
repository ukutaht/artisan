import Api from 'api'
import fakePromise from 'helpers/fake-promise'
import UserService from 'users/service'

const users = new UserService()

describe('Users service', () => {
  const loginSuccess = {
    token: 'token',
    user: {
      name: 'User name'
    }
  }

  it('logs user in', () => {
    spyOn(Api, 'post').and.callFake(() => fakePromise.resolve(loginSuccess))

    users.login()
    expect(users.current.name).toEqual('User name')
    expect(users.token).toEqual('token')
  })

  it('logs user out', () => {
    spyOn(Api, 'post').and.callFake(() => fakePromise.resolve(loginSuccess))

    users.logout()
    expect(users.current).toBeNull()
    expect(users.token).toBeNull()
  })
})
