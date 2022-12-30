import { v4 as uuidv4 } from 'uuid'
import container from '../../../container'
import { EventBus } from '../bus'
import { Event } from '../Event'
import { Publisher } from '../publisher'
import { Subscriber } from '../Subscriber'

describe('Event System', () => {
  it('should publish message to a certain topic', () => {
    const eventBus = container.get(EventBus)
    const topic = 'topic'
    const message = 'message'
    const event = new Event(topic, message)

    const subscriber = new Subscriber(uuidv4(), topic, (event: Event) => {
      expect(event.data).toBe(message)
    })

    eventBus.subscribe(subscriber)
    eventBus.publish(event)
  })

  it('should return all topics for which there are publishers', () => {
    const eventBus = container.get(EventBus)
    const topics = ['topic1', 'topic2']

    topics.forEach((topic) => {
      eventBus.register(new Publisher(topic))
    })

    expect(eventBus.topics()).toEqual(topics)
  })
})
