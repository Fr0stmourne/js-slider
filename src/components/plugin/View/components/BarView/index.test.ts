import { EventTypes } from 'types';
import BarView from '.';

describe('BarView', () => {
  let bar: BarView;

  beforeEach(() => {
    bar = new BarView(0, 100, false);
  });

  test('should store HTML element as .element property', () => {
    expect(bar.element).toBeInstanceOf(HTMLElement);
  });

  test('should call callback on bar mousedown', () => {
    const callback = jest.fn();
    bar.on(EventTypes.NewBarValue, callback);

    expect(callback).not.toHaveBeenCalled();
    bar.element.dispatchEvent(new Event('mousedown'));
    expect(callback).toHaveBeenCalled();
  });
});
