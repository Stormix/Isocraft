export class Event<T = any> {
  constructor(public topic: string, public data: T) {}
}
