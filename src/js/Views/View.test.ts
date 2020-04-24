import View from './View';

const testOptions: any = {
  normal: {
    minValue: -30,
    maxValue: 100,
    step: 5,
    defaultValue: 45,
  },

  vertical: {
    minValue: -30,
    maxValue: 100,
    step: 5,
    defaultValue: 45,
    isVertical: true,
  },
  range: {
    minValue: 0,
    maxValue: 100,
    step: 2,
    defaultValue: [6, 64],
    range: true,
  },
  rangeVertical: {
    minValue: 0,
    maxValue: 100,
    step: 2,
    defaultValue: [6, 64],
    range: true,
    isVertical: true,
  },
};

function testHandler(): number {
  return 1 + 1;
}

let defaultView: View, verticalView: View, rangeView: View, rangeVerticalView: View;
// let verticalView: View;
// let rangeView: View;
// let rangeVerticalView: View;

describe('View constructor', () => {
  beforeAll(() => {
    defaultView = new View(testOptions.normal);
    verticalView = new View(testOptions.vertical);
    rangeView = new View(testOptions.range);
    rangeVerticalView = new View(testOptions.rangeVertical);
  });
  test('should return HTMLElement instance as view.element', () => {
    const view: View = defaultView;
    expect(view.element).toBeInstanceOf(HTMLElement);

    Object.values(view._elements).forEach(el => {
      expect(el).toBeInstanceOf(HTMLElement);
    });
  });

  test('should return HTMLElement instance as view.element: range case', () => {
    const view = rangeView;
    expect(view.element).toBeInstanceOf(HTMLElement);

    Object.values(view._elements).forEach(el => {
      expect(el).toBeInstanceOf(HTMLElement);
    });
  });
  test('should return HTMLElement instance as view.element: vertical case', () => {
    const view = verticalView;
    expect(view.element).toBeInstanceOf(HTMLElement);

    Object.values(view._elements).forEach(el => {
      expect(el).toBeInstanceOf(HTMLElement);
    });
  });
  test('should return HTMLElement instance as view.element: range vertical case', () => {
    const view = rangeVerticalView;
    expect(view.element).toBeInstanceOf(HTMLElement);

    Object.values(view._elements).forEach(el => {
      expect(el).toBeInstanceOf(HTMLElement);
    });
  });
});

describe('Update value()', () => {
  beforeAll(() => {
    defaultView = new View(testOptions.normal);
    verticalView = new View(testOptions.vertical);
    rangeView = new View(testOptions.range);
    rangeVerticalView = new View(testOptions.rangeVertical);
  });
  test('should correctly update pin value', () => {
    const view = defaultView;
    view.updateValue(100);
    expect(view._elements.firstValue.textContent.trim()).toBe('100');

    view.updateValue(-30);
    expect(view._elements.firstValue.textContent.trim()).toBe('-30');

    view.updateValue(54);
    expect(view._elements.firstValue.textContent.trim()).toBe('54');
  });
  test('should correctly update pin value: range case', () => {
    const view = rangeView;
    view.updateValue([30, 50]);
    expect(view._elements.firstValue.textContent.trim()).toBe('30');
    expect(view._elements.secondPin.textContent.trim()).toBe('50');

    view.updateValue([25, 75]);
    expect(view._elements.firstValue.textContent.trim()).toBe('25');
    expect(view._elements.secondPin.textContent.trim()).toBe('75');
  });
  test('should correctly update pin value: vertical case', () => {
    const view = verticalView;
    view.updateValue(100);
    expect(view._elements.firstValue.textContent.trim()).toBe('100');

    view.updateValue(-30);
    expect(view._elements.firstValue.textContent.trim()).toBe('-30');

    view.updateValue(54);
    expect(view._elements.firstValue.textContent.trim()).toBe('54');
  });
  test('should correctly update pin value: range vertical case', () => {
    const view = rangeVerticalView;
    view.updateValue([30, 50]);
    expect(view._elements.firstValue.textContent.trim()).toBe('30');
    expect(view._elements.secondPin.textContent.trim()).toBe('50');

    view.updateValue([25, 75]);
    expect(view._elements.firstValue.textContent.trim()).toBe('25');
    expect(view._elements.secondPin.textContent.trim()).toBe('75');
  });

  test('should throw an error if the passed value is not correct', () => {
    const view = defaultView;

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
  test('should throw an error if the passed value is not correct: range', () => {
    const view = rangeView;

    expect(() => {
      view.updateValue([-150, 120]);
    }).toThrow(Error);
    expect(() => {
      view.updateValue([-1000, 1000]);
    }).toThrow(Error);
    expect(() => {
      view.updateValue([-31, 940]);
    }).toThrow(Error);
  });
  test('should throw an error if the passed value is not correct: vertical', () => {
    const view = verticalView;

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
  test('should throw an error if the passed value is not correct: range vertical', () => {
    const view = rangeVerticalView;

    expect(() => {
      view.updateValue([-150, 120]);
    }).toThrow(Error);
    expect(() => {
      view.updateValue([-1000, 1000]);
    }).toThrow(Error);
    expect(() => {
      view.updateValue([-31, 940]);
    }).toThrow(Error);
  });

  test('should update hidden input', () => {
    const view = defaultView;
    view.updateValue(50);
    expect(view._elements.input.value).toBe('50');
  });

  test('should update hidden input: range', () => {
    const view = rangeView;
    view.updateValue([50, 70]);
    expect(view._elements.input.value).toBe('50,70');
  });

  test('should update hidden input: vertical', () => {
    const view = verticalView;
    view.updateValue(50);
    expect(view._elements.input.value).toBe('50');
  });

  test('should update hidden input: range vertical', () => {
    const view = rangeVerticalView;
    view.updateValue([50, 70]);
    expect(view._elements.input.value).toBe('50,70');
  });
});

describe('Bind move pin()', () => {
  beforeAll(() => {
    defaultView = new View(testOptions.normal);
    verticalView = new View(testOptions.vertical);
    rangeView = new View(testOptions.range);
    rangeVerticalView = new View(testOptions.rangeVertical);
  });
  test('should bind onmousedown listener with the passed callback', () => {
    const view = defaultView;
    expect(view._elements.firstPin.onmousedown).toBeNull();

    view.bindMovePin(testHandler);

    expect(view._elements.firstPin.onmousedown).toBeInstanceOf(Function);

    expect(view._elements.firstPin.onmousemove).toBeNull();
    expect(view._elements.firstPin.onmouseup).toBeNull();
  });

  test('should bind onmousedown listener with the passed callback: range', () => {
    const view = rangeView;
    expect(view._elements.firstPin.onmousedown).toBeNull();
    expect(view._elements.secondPin.onmousedown).toBeNull();

    view.bindMovePin(testHandler);

    expect(view._elements.firstPin.onmousedown).toBeInstanceOf(Function);
    expect(view._elements.secondPin.onmousedown).toBeInstanceOf(Function);

    expect(view._elements.firstPin.onmousemove).toBeNull();
    expect(view._elements.firstPin.onmouseup).toBeNull();
    expect(view._elements.secondPin.onmousemove).toBeNull();
    expect(view._elements.secondPin.onmouseup).toBeNull();
  });
  test('should bind onmousedown listener with the passed callback: vertical', () => {
    const view = verticalView;
    expect(view._elements.firstPin.onmousedown).toBeNull();

    view.bindMovePin(testHandler);

    expect(view._elements.firstPin.onmousedown).toBeInstanceOf(Function);

    expect(view._elements.firstPin.onmousemove).toBeNull();
    expect(view._elements.firstPin.onmouseup).toBeNull();
  });

  test('should bind onmousedown listener with the passed callback: range vertical', () => {
    const view = rangeVerticalView;
    expect(view._elements.firstPin.onmousedown).toBeNull();
    expect(view._elements.secondPin.onmousedown).toBeNull();

    view.bindMovePin(testHandler);

    expect(view._elements.firstPin.onmousedown).toBeInstanceOf(Function);
    expect(view._elements.secondPin.onmousedown).toBeInstanceOf(Function);

    expect(view._elements.firstPin.onmousemove).toBeNull();
    expect(view._elements.firstPin.onmouseup).toBeNull();
    expect(view._elements.secondPin.onmousemove).toBeNull();
    expect(view._elements.secondPin.onmouseup).toBeNull();
  });
});

describe('Bind input change()', () => {
  beforeAll(() => {
    defaultView = new View(testOptions.normal);
    verticalView = new View(testOptions.vertical);
    rangeView = new View(testOptions.range);
    rangeVerticalView = new View(testOptions.rangeVertical);
  });
  test('should bind onmousedown listener with the passed callback', () => {
    const view = defaultView;
    expect(view._elements.input.onchange).toBeNull();

    view.bindInputChange(testHandler);

    expect(view._elements.input.onchange).toBeInstanceOf(Function);
  });

  test('should bind onmousedown listener with the passed callback: range', () => {
    const view = rangeView;
    expect(view._elements.input.onchange).toBeNull();

    view.bindInputChange(testHandler);

    expect(view._elements.input.onchange).toBeInstanceOf(Function);
  });
  test('should bind onmousedown listener with the passed callback: vertical', () => {
    const view = verticalView;
    expect(view._elements.input.onchange).toBeNull();

    view.bindInputChange(testHandler);

    expect(view._elements.input.onchange).toBeInstanceOf(Function);
  });

  test('should bind onmousedown listener with the passed callback: range vertical', () => {
    const view = rangeVerticalView;
    expect(view._elements.input.onchange).toBeNull();

    view.bindInputChange(testHandler);

    expect(view._elements.input.onchange).toBeInstanceOf(Function);
  });
});
