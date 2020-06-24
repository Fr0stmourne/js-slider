import InputView from '.';

describe('InputView', () => {
  let input: InputView, input2: InputView;

  beforeEach(() => {
    input = new InputView(45);
    input2 = new InputView([45, 94]);
  });
  test('should store HTML element as element property', () => {
    expect(input.element).toBeInstanceOf(HTMLElement);
    expect(input2.element).toBeInstanceOf(HTMLElement);
  });

  describe('value getter/setter', () => {
    test('should return correct value after an instance initialization', () => {
      expect(input.getValue()).toBe(45);
      expect(input2.getValue()).toStrictEqual([45, 94]);
    });

    test('should return correct value after value setter call', () => {
      input.setValue(54);
      expect(input.getValue()).toBe(54);
      input2.setValue([49, 73]);
      expect(input2.getValue()).toStrictEqual([49, 73]);
    });
  });
});
