import Observer from '.';
import { EventTypes } from '../types';

describe('Observer', () => {
  let observer: Observer;

  beforeEach(() => {
    observer = new Observer();
  });
  describe('on()', () => {
    test('should correctly attach callbacks to event', () => {
      const callback = jest.fn();
      const anotherCallback = jest.fn();
      const finalCallback = jest.fn();

      observer.on(EventTypes.StateChanged, callback);
      observer.on(EventTypes.StateChanged, anotherCallback);
      observer.on(EventTypes.StateChanged, finalCallback);

      expect(observer.events[EventTypes.StateChanged].length).toBe(3);
    });
  });

  describe('emit()', () => {
    test('should correctly emit events to run callbacks', () => {
      const callback = jest.fn();
      observer.on(EventTypes.StateChanged, callback);
      observer.emit(EventTypes.StateChanged);
      expect(callback).toHaveBeenCalled();
    });
  });
});
