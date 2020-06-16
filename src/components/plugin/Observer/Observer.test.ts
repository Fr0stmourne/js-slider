import Observer from './Observer';
import { EventTypes } from '../interfaces';

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

      observer.on(EventTypes.stateChanged, callback);
      observer.on(EventTypes.stateChanged, anotherCallback);
      observer.on(EventTypes.stateChanged, finalCallback);

      expect(observer.events[EventTypes.stateChanged].length).toBe(3);
    });
  });

  describe('emit()', () => {
    test('should correctly emit events to run callbacks', () => {
      const callback = jest.fn();
      observer.on(EventTypes.stateChanged, callback);
      observer.emit(EventTypes.stateChanged);
      expect(callback).toHaveBeenCalled();
    });
  });
});
