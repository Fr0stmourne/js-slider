import { EventTypes } from 'types';
import BarView from '.';

describe('BarView', () => {
  let bar: BarView;
  let verticalBar: BarView;

  beforeEach(() => {
    bar = new BarView(0, 100, false);
    verticalBar = new BarView(0, 100, true);
  });

  describe('constructor', () => {
    beforeEach(() => {
      bar = new BarView(0, 100, false);
      verticalBar = new BarView(0, 100, true);
    });
    test('should store HTML element as .element property', () => {
      expect(bar.element).toBeInstanceOf(HTMLElement);
    });
  });

  describe('should call callback on bar mousedown', () => {
    const callback = jest.fn();
    const anotherCallback = jest.fn();

    beforeEach(() => {
      bar = new BarView(0, 100, false);
      verticalBar = new BarView(0, 100, true);
      bar.on(EventTypes.NewBarValue, callback);
      verticalBar.on(EventTypes.NewBarValue, anotherCallback);
    });

    test('default case', () => {
      expect(callback).not.toHaveBeenCalled();
      bar.element.dispatchEvent(new Event('mousedown'));
      expect(callback).toHaveBeenCalled();
    });

    test('vertical case', () => {
      expect(anotherCallback).not.toHaveBeenCalled();
      verticalBar.element.dispatchEvent(new Event('mousedown'));
      expect(anotherCallback).toHaveBeenCalled();
    });
  });
});
