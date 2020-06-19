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
      expect(input.value).toBe(45);
      expect(input2.value).toStrictEqual([45, 94]);
    });

    test('should return correct value after value setter call', () => {
      input.value = 54;
      expect(input.value).toBe(54);
      input2.value = [49, 73];
      expect(input2.value).toStrictEqual([49, 73]);
    });
  });
});
