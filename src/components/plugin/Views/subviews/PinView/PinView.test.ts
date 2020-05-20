import PinView from './PinView';

const options = {
  minValue: -30,
  maxValue: 100,
  step: 5,
  defaultValue: 45,
};

const options2 = {
  minValue: 0,
  maxValue: 100,
  step: 2,
  defaultValue: 94,
};

describe('PinView', () => {
  test('should store HTML element as _element property', () => {
    const pin = new PinView(options, 1);

    expect(pin.element).toBeInstanceOf(HTMLElement);
  });

  describe('value getter', () => {
    const pin = new PinView(options, 1);
    const pin2 = new PinView(options2, 2);

    const pxNum = 0;

    test('should return correct value after an instance initialization', () => {
      expect(pin.value).toBe(45);
      expect(pin2.value).toBe(94);
    });

    test('should return correct value after updateValue method call', () => {
      pin.updateValue(pxNum, 22);
      expect(pin.value).toBe(22);

      pin2.updateValue(pxNum, 74);
      expect(pin2.value).toBe(74);
    });
  });
});
