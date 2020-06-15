import Observer from './Observer';

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

      observer.on('1', callback);
      observer.on('1', anotherCallback);
      observer.on('1', finalCallback);

      expect(observer.events['1'].length).toBe(3);
    });
  });

  describe('emit()', () => {
    test('should correctly emit events to run callbacks', () => {
      const callback = jest.fn();
      observer.on('test', callback);
      observer.emit('test');
      expect(callback).toHaveBeenCalled();
    });
  });
});
