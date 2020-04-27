import InputView from './InputView';

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

describe('InputView', () => {
  test('should store HTML element as _element property', () => {
    const input = new InputView(options.defaultValue);

    expect(input.element).toBeInstanceOf(HTMLElement);
  });

  describe('value getter/setter', () => {
    const input = new InputView(options.defaultValue);
    const input2 = new InputView(options2.defaultValue);

    test('should return correct value after an instance initialization', () => {
      expect(input.value).toBe(45);
      expect(input2.value).toBe(94);
    });

    test('should return correct value after value setter call', () => {
      input.value = 54;
      expect(input.value).toBe(54);
      input2.value = 73;
      expect(input2.value).toBe(73);
    });
  });
});
