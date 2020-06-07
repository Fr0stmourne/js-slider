import PinView from './PinView';
import { PinData } from '../../../interfaces';

const options: PinData = {
  pinNumber: 1,
  isTooltipDisabled: false,
  isVertical: true,
  value: 50,
};
const options1: PinData = {
  pinNumber: 2,
  isTooltipDisabled: true,
  isVertical: false,
  value: 70,
};

const pxNum = 10;

describe('PinView', () => {
  let pin: PinView, pin1: PinView;
  beforeEach(() => {
    pin = new PinView(options);
    pin1 = new PinView(options1);
  });
  test('should store HTML element as _element property', () => {
    expect(pin.element).toBeInstanceOf(HTMLElement);
    expect(pin1.element).toBeInstanceOf(HTMLElement);
  });

  describe('value getter', () => {
    test('should return correct value after an instance initialization', () => {
      expect(pin.value).toBe(50);
      expect(pin1.value).toBe(70);
    });

    test('should correctly update the value after updateValue method call', () => {
      pin.updateValue(pxNum, 52);
      expect(pin.value).toBe(52);

      pin1.updateValue(pxNum, 74);
      expect(pin1.value).toBe(74);
    });

    test('should correctly update textContent prop after updateValue method call', () => {
      pin.updateValue(pxNum, 52);
      expect(pin.element.textContent.trim()).toBe('52');

      pin1.updateValue(pxNum, 74);
      expect(pin1.element.textContent.trim()).toBe('74');
    });
  });
});
