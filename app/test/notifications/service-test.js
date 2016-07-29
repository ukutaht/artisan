import * as notifications from 'notifications/service'

describe('Notifications service', () => {
  it('sends notifications to a subscriber', () => {
    const subscriber = jasmine.createSpy('subscriber')
    notifications.subscribe(subscriber)

    notifications.info('Information')

    expect(subscriber).toHaveBeenCalled()
    const notification = subscriber.calls.mostRecent().args[0]
    expect(notification.type).toEqual('info')
    expect(notification.text).toEqual('Information')
  })

  it('sends error notification to subscriber', () => {
    const subscriber = jasmine.createSpy('subscriber')
    notifications.subscribe(subscriber)

    notifications.error('Error')

    expect(subscriber).toHaveBeenCalled()
    const notification = subscriber.calls.mostRecent().args[0]
    expect(notification.type).toEqual('error')
    expect(notification.text).toEqual('Error')
  })

  it('timeout defaults to 2500ms', () => {
    const subscriber = jasmine.createSpy('subscriber')
    notifications.subscribe(subscriber)

    notifications.info('Information')

    expect(subscriber).toHaveBeenCalled()
    const notification = subscriber.calls.mostRecent().args[0]
    expect(notification.timeout).toEqual(2500)
  })
})
