import { Events } from '../interfaces';

export default class Observer {
  constructor(public events: Events = {}) {}

  on(eventName: string, callback: Function): void {
    const callbacks = this.events[eventName];

    console.log(`event ${eventName} caused callback`);

    if (callbacks) {
      callbacks.push(callback);
    } else {
      this.events[eventName] = [callback];
    }
  }

  emit(eventName: string, data?: {}): void {
    const event = this.events[eventName];
    console.log(`event ${eventName} triggered`);

    if (event) {
      event.forEach((func: Function) => func(data));
    }
  }
}
