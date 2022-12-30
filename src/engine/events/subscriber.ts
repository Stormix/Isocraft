import { v4 } from 'uuid'
import { Event } from './Event'
import { EventBus } from './bus'

export type EventCallback = (event: Event) => void
export class Subscriber {
  private _eventbus?: EventBus
  constructor(public readonly _id: string, public readonly _topic: string, public readonly _callback: EventCallback) {}

  get id(): string {
    return this._id
  }

  get topic(): string {
    return this._topic
  }

  get callback(): EventCallback {
    return this._callback
  }

  get eventbus(): EventBus {
    return this._eventbus!
  }

  set eventbus(value: EventBus) {
    this._eventbus = value
  }

  public notify(event: Event): void {
    this._callback(event)
  }

  public static fromTopic(topic: string, callback: EventCallback): Subscriber {
    return new Subscriber(v4(), topic, callback)
  }
}
