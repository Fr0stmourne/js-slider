import View from './View';

const testOptions: any = {
  normal: {
    minValue: -30,
    maxValue: 100,
    step: 5,
    defaultValue: 45,
  },
};

describe('calculateValue', () => {
  test('should return HTMLElement instance as view.element', () => {
    const view = new View(testOptions.normal);
    expect(view.element).toBeInstanceOf(HTMLElement);
  });

  test('should correctly update pin value', () => {
    const view = new View(testOptions.normal);
    view.updateValue(100);
    expect(view._elements.firstValue.textContent).toBe('100');

    view.updateValue(-30);
    expect(view._elements.firstValue.textContent).toBe('-30');

    view.updateValue(54);
    expect(view._elements.firstValue.textContent).toBe('54');
  });
  test('should throw an error if the passed value is not correct', () => {
    const view = new View(testOptions.normal);

    expect(() => {
      view.updateValue(120);
    }).toThrow(Error);
    expect(() => {
      view.updateValue(-1000);
    }).toThrow(Error);
    expect(() => {
      view.updateValue(-31);
    }).toThrow(Error);
  });
});
