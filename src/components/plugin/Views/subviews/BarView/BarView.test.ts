import BarView from './BarView';
import { BarData, EventTypes } from '../../../interfaces';

describe('BarView', () => {
  let bar: BarView;

  beforeEach(() => {
    const barData: BarData = {
      isVertical: false,
      minValue: 0,
      maxValue: 100,
    };
    bar = new BarView(barData);
  });

  test('should store HTML element as .element property', () => {
    expect(bar.element).toBeInstanceOf(HTMLElement);
  });

  test('should call callback on bar mousedown', () => {
    const callback = jest.fn();
    bar.on(EventTypes.newBarValue, callback);

    expect(callback).not.toHaveBeenCalled();
    bar.element.dispatchEvent(new Event('mousedown'));
    expect(callback).toHaveBeenCalled();
  });
});
