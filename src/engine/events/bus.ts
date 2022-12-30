import { Event } from './Event'
import { Publisher } from './publisher'
import { Subscriber } from './subscriber'

export class EventBus {
  private _listeners: Record<string, Subscriber[]>
  private _publishers: Record<string, Publisher[]>

  constructor() {
    this._listeners = {}
    this._publishers = {}
  }

  public subscribe(subscriber: Subscriber): void {
    const { topic } = subscriber

    if (!this._listeners[topic]) {
      this._listeners[topic] = []
    }
    subscriber.eventbus = this
    this._listeners[topic].push(subscriber)
  }

  public unsubscribe(subscriber: Subscriber): void {
    const { topic } = subscriber

    if (!this._listeners[topic]) {
      return
    }
    const index = this._listeners[topic].indexOf(subscriber)
    if (index !== -1) {
      this._listeners[topic].splice(index, 1)
    }
  }

  public publish(event: Event): void {
    const { topic } = event
    if (!this._listeners[topic]) {
      return
    }
    this._listeners[topic].forEach((subscriber) => {
      subscriber.notify(event)
    })
  }

  public register(publisher: Publisher): void {
    const { topic } = publisher
    if (!this._publishers[topic]) {
      this._publishers[topic] = []
    }
    publisher.eventbus = this
    this._publishers[topic].push(publisher)
  }

  public unregister(publisher: Publisher): void {
    const { topic } = publisher

    if (!this._publishers[topic]) {
      return
    }
    const index = this._publishers[topic].indexOf(publisher)
    if (index !== -1) {
      this._publishers[topic].splice(index, 1)
    }
  }

  public topics(): string[] {
    return [...Object.keys(this._publishers)]
  }

  public getSubscribers(topic: string): Subscriber[] {
    return this._listeners[topic] || []
  }
}
