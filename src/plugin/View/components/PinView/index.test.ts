import { PinData } from 'types';

import PinView from '.';

const options: PinData = {
  pinNumber: 1,
  isTooltipDisabled: false,
  isVertical: true,
  value: 50,
  container: document.createElement('div'),
};
const options1: PinData = {
  pinNumber: 2,
  isTooltipDisabled: true,
  isVertical: false,
  value: 70,
  container: document.createElement('div'),
};

const pxValue = 10;

describe('PinView', () => {
  let pin: PinView, pin1: PinView;
  beforeEach(() => {
    pin = new PinView(
      options.pinNumber,
      options.value,
      options.isTooltipDisabled,
      options.isVertical,
      options.container,
    );
    pin1 = new PinView(
      options1.pinNumber,
      options1.value,
      options1.isTooltipDisabled,
      options1.isVertical,
      options1.container,
    );
  });
  test('should store HTML element as element property', () => {
    expect(pin.element).toBeInstanceOf(HTMLElement);
    expect(pin1.element).toBeInstanceOf(HTMLElement);
  });

  describe('value getter', () => {
    test('should return correct value after an instance initialization', () => {
      expect(pin.getValue()).toBe(50);
      expect(pin1.getValue()).toBe(70);
    });

    test('should correctly update the value after updateValue method call', () => {
      pin.updateValue(pxValue, 52);
      expect(pin.getValue()).toBe(52);

      pin1.updateValue(pxValue, 74);
      expect(pin1.getValue()).toBe(74);
    });

    test('should correctly update textContent prop after updateValue method call', () => {
      pin.updateValue(pxValue, 52);
      expect(pin.element.textContent?.trim()).toBe('52');

      pin1.updateValue(pxValue, 74);
      expect(pin1.element.textContent?.trim()).toBe('74');
    });
  });
});
