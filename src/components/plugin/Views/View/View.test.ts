import Options from '../../types';
import View from './View';

const testOptions: { normal: Options; vertical: Options; range: Options; rangeVertical: Options } = {
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
  });

  test('should return HTMLElement instance as view.element: range case', () => {
    const view = rangeView;
    expect(view.element).toBeInstanceOf(HTMLElement);
  });
  test('should return HTMLElement instance as view.element: vertical case', () => {
    const view = verticalView;
    expect(view.element).toBeInstanceOf(HTMLElement);
  });
  test('should return HTMLElement instance as view.element: range vertical case', () => {
    const view = rangeVerticalView;
    expect(view.element).toBeInstanceOf(HTMLElement);
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
    expect(view._objects.firstPin.value).toBe(100);

    view.updateValue(-30);
    expect(view._objects.firstPin.value).toBe(-30);

    view.updateValue(54);
    expect(view._objects.firstPin.value).toBe(54);
  });
  test('should correctly update pin value: range case', () => {
    const view = rangeView;
    view.updateValue([30, 50]);
    expect(view._objects.firstPin.value).toBe(30);
    expect(view._objects.secondPin.value).toBe(50);

    view.updateValue([25, 75]);
    expect(view._objects.firstPin.value).toBe(25);
    expect(view._objects.secondPin.value).toBe(75);
  });
  test('should correctly update pin value: vertical case', () => {
    const view = verticalView;
    view.updateValue(100);
    expect(view._objects.firstPin.value).toBe(100);

    view.updateValue(-30);
    expect(view._objects.firstPin.value).toBe(-30);

    view.updateValue(54);
    expect(view._objects.firstPin.value).toBe(54);
  });
  test('should correctly update pin value: range vertical case', () => {
    const view = rangeVerticalView;
    view.updateValue([30, 50]);
    expect(view._objects.firstPin.value).toBe(30);
    expect(view._objects.secondPin.value).toBe(50);

    view.updateValue([25, 75]);
    expect(view._objects.firstPin.value).toBe(25);
    expect(view._objects.secondPin.value).toBe(75);
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

  test('should update hidden input.element', () => {
    const view = defaultView;
    view.updateValue(50);
    expect((view._objects.input.element as HTMLInputElement).value).toBe('50');
  });

  test('should update hidden input.element: range', () => {
    const view = rangeView;
    view.updateValue([50, 70]);
    expect((view._objects.input.element as HTMLInputElement).value).toBe('50,70');
  });

  test('should update hidden input.element: vertical', () => {
    const view = verticalView;
    view.updateValue(50);
    expect((view._objects.input.element as HTMLInputElement).value).toBe('50');
  });

  test('should update hidden input.element: range vertical', () => {
    const view = rangeVerticalView;
    view.updateValue([50, 70]);
    expect((view._objects.input.element as HTMLInputElement).value).toBe('50,70');
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
    expect(view._objects.firstPin.element.onmousedown).toBeNull();

    view.bindMovePin(testHandler);

    expect(view._objects.firstPin.element.onmousedown).toBeInstanceOf(Function);

    expect(view._objects.firstPin.element.onmousemove).toBeNull();
    expect(view._objects.firstPin.element.onmouseup).toBeNull();
  });

  test('should bind onmousedown listener with the passed callback: range', () => {
    const view = rangeView;
    expect(view._objects.firstPin.element.onmousedown).toBeNull();
    expect(view._objects.secondPin.element.onmousedown).toBeNull();

    view.bindMovePin(testHandler);

    expect(view._objects.firstPin.element.onmousedown).toBeInstanceOf(Function);
    expect(view._objects.secondPin.element.onmousedown).toBeInstanceOf(Function);

    expect(view._objects.firstPin.element.onmousemove).toBeNull();
    expect(view._objects.firstPin.element.onmouseup).toBeNull();
    expect(view._objects.secondPin.element.onmousemove).toBeNull();
    expect(view._objects.secondPin.element.onmouseup).toBeNull();
  });
  test('should bind onmousedown listener with the passed callback: vertical', () => {
    const view = verticalView;
    expect(view._objects.firstPin.element.onmousedown).toBeNull();

    view.bindMovePin(testHandler);

    expect(view._objects.firstPin.element.onmousedown).toBeInstanceOf(Function);

    expect(view._objects.firstPin.element.onmousemove).toBeNull();
    expect(view._objects.firstPin.element.onmouseup).toBeNull();
  });

  test('should bind onmousedown listener with the passed callback: range vertical', () => {
    const view = rangeVerticalView;
    expect(view._objects.firstPin.element.onmousedown).toBeNull();
    expect(view._objects.secondPin.element.onmousedown).toBeNull();

    view.bindMovePin(testHandler);

    expect(view._objects.firstPin.element.onmousedown).toBeInstanceOf(Function);
    expect(view._objects.secondPin.element.onmousedown).toBeInstanceOf(Function);

    expect(view._objects.firstPin.element.onmousemove).toBeNull();
    expect(view._objects.firstPin.element.onmouseup).toBeNull();
    expect(view._objects.secondPin.element.onmousemove).toBeNull();
    expect(view._objects.secondPin.element.onmouseup).toBeNull();
  });
});

describe('Bind input.element change()', () => {
  beforeAll(() => {
    defaultView = new View(testOptions.normal);
    verticalView = new View(testOptions.vertical);
    rangeView = new View(testOptions.range);
    rangeVerticalView = new View(testOptions.rangeVertical);
  });
  test('should bind onmousedown listener with the passed callback', () => {
    const view = defaultView;
    expect(view._objects.input.element.onchange).toBeNull();

    view.bindInputChange(testHandler);

    expect(view._objects.input.element.onchange).toBeInstanceOf(Function);
  });

  test('should bind onmousedown listener with the passed callback: range', () => {
    const view = rangeView;
    expect(view._objects.input.element.onchange).toBeNull();

    view.bindInputChange(testHandler);

    expect(view._objects.input.element.onchange).toBeInstanceOf(Function);
  });
  test('should bind onmousedown listener with the passed callback: vertical', () => {
    const view = verticalView;
    expect(view._objects.input.element.onchange).toBeNull();

    view.bindInputChange(testHandler);

    expect(view._objects.input.element.onchange).toBeInstanceOf(Function);
  });

  test('should bind onmousedown listener with the passed callback: range vertical', () => {
    const view = rangeVerticalView;
    expect(view._objects.input.element.onchange).toBeNull();

    view.bindInputChange(testHandler);

    expect(view._objects.input.element.onchange).toBeInstanceOf(Function);
  });
});
