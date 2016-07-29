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

  it('assigns ids to notifications', () => {
    const subscriber = jasmine.createSpy('subscriber')
    notifications.subscribe(subscriber)

    notifications.info('Information1')
    notifications.info('Information2')
    notifications.info('Information3')

    const notification1 = subscriber.calls.argsFor(0)[0]
    const notification2 = subscriber.calls.argsFor(1)[0]
    const notification3 = subscriber.calls.argsFor(2)[0]
    expect(notification2.id).toEqual(notification1.id + 1)
    expect(notification3.id).toEqual(notification2.id + 1)
  })
})
