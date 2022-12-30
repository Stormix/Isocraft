import { Event } from './Event'
import { EventBus } from './bus'
import { EventCallback, Subscriber } from './subscriber'

export class Publisher {
  private readonly _topic: string
  private _eventbus?: EventBus

  constructor(topic: string) {
    this._topic = topic
  }

  get eventbus(): EventBus {
    return this._eventbus!
  }

  set eventbus(value: EventBus) {
    this._eventbus = value
  }

  get topic(): string {
    return this._topic
  }

  public publish(event: Event): void {
    const subscribers = this._eventbus?.getSubscribers(this._topic) ?? []
    this._processAndFireSubscribers(subscribers, event)
  }

  private _processAndFireSubscribers(subscribers: Subscriber[], event: Event) {
    for (const subscriber of subscribers) {
      const { callback } = subscriber
      this._fireSubscriber(subscriber, event, callback)
    }
  }

  private _fireSubscriber(context: Subscriber, state: Event, callback: EventCallback): void {
    callback.call(context, state)
  }
}
