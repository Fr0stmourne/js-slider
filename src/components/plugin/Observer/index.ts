import { Events, EventTypes, EventCallback } from '../types';

class Observer {
  constructor(public events: Events = {}) {}

  on(eventName: keyof typeof EventTypes, callback: EventCallback): void {
    const callbacks = this.events[eventName];

    if (callbacks && !callbacks.includes(callback)) {
      callbacks.push(callback);
    } else {
      this.events[eventName] = [callback];
    }
  }

  emit(eventName: keyof typeof EventTypes, data?: {}): void {
    const event = this.events[eventName];

    if (event) {
      event.forEach((func: EventCallback) => func(data));
    }
  }
}

export default Observer;
