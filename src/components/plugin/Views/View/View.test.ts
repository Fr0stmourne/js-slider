import { ViewState, ModelState } from '../../interfaces';
import View from './View';

const testOptions: {
  normal: { viewState: ViewState; modelState: ModelState };
  vertical: { viewState: ViewState; modelState: ModelState };
  range: { viewState: ViewState; modelState: ModelState };
} = {
  normal: {
    viewState: {
      isTooltipDisabled: false,
      isVertical: false,
      scaleOptionsNum: 5,
    },
    modelState: {
      minValue: -30,
      maxValue: 100,
      step: 5,
      value: 45,
      range: false,
    },
  },

  vertical: {
    viewState: {
      isTooltipDisabled: false,
      isVertical: true,
      scaleOptionsNum: 5,
    },
    modelState: {
      minValue: -30,
      maxValue: 100,
      step: 5,
      value: 45,
      range: false,
    },
  },

  range: {
    viewState: {
      isTooltipDisabled: true,
      isVertical: false,
      scaleOptionsNum: 10,
    },
    modelState: {
      minValue: 0,
      maxValue: 100,
      step: 1,
      value: [45, 75],
      range: true,
    },
  },
};

let callback: Function;

let defaultView: View, verticalView: View, rangeView: View;
beforeEach(() => {
  defaultView = new View(testOptions.normal.viewState, testOptions.normal.modelState);
  verticalView = new View(testOptions.vertical.viewState, testOptions.vertical.modelState);
  rangeView = new View(testOptions.range.viewState, testOptions.range.modelState);
});

describe('View constructor', () => {
  test('should return HTMLElement instance as view.element', () => {
    expect(defaultView.element).toBeInstanceOf(HTMLElement);
    expect(verticalView.element).toBeInstanceOf(HTMLElement);
    expect(rangeView.element).toBeInstanceOf(HTMLElement);
  });
});

describe('Update value()', () => {
  test('should correctly update pin value', () => {
    defaultView.updateValue(100);
    expect(defaultView._objects.firstPin.value).toBe(100);

    verticalView.updateValue(-30);
    expect(verticalView._objects.firstPin.value).toBe(-30);

    rangeView.updateValue([30, 50]);
    expect(rangeView._objects.firstPin.value).toBe(30);
    expect(rangeView._objects.secondPin.value).toBe(50);
  });

  test('should throw an error if the passed value is not correct', () => {
    expect(() => {
      defaultView.updateValue(120);
    }).toThrow(Error);
    expect(() => {
      verticalView.updateValue(-1000);
    }).toThrow(Error);
    expect(() => {
      rangeView.updateValue([-900, -700]);
    }).toThrow(Error);
  });

  test('should update hidden input.element', () => {
    defaultView.updateValue(50);
    expect((defaultView._objects.input.element as HTMLInputElement).value).toBe('50');

    verticalView.updateValue(30);
    expect((verticalView._objects.input.element as HTMLInputElement).value).toBe('30');

    rangeView.updateValue([50, 70]);
    expect((rangeView._objects.input.element as HTMLInputElement).value).toBe('50,70');
  });
});

describe('bindMovePin()', () => {
  beforeEach(() => {
    callback = jest.fn();
  });
  test('should bind onmousedown listener with the passed callback', () => {
    expect(defaultView._objects.firstPin.element.onmousedown).toBeNull();

    defaultView.bindMovePin(callback);

    expect(defaultView._objects.firstPin.element.onmousedown).toBeInstanceOf(Function);
    expect(defaultView._objects.firstPin.element.onmousemove).toBeNull();
    expect(defaultView._objects.firstPin.element.onmouseup).toBeNull();
  });

  test('should bind onmousedown listener with the passed callback: range', () => {
    expect(rangeView._objects.firstPin.element.onmousedown).toBeNull();
    expect(rangeView._objects.secondPin.element.onmousedown).toBeNull();

    rangeView.bindMovePin(callback);

    expect(rangeView._objects.firstPin.element.onmousedown).toBeInstanceOf(Function);
    expect(rangeView._objects.secondPin.element.onmousedown).toBeInstanceOf(Function);

    expect(rangeView._objects.firstPin.element.onmousemove).toBeNull();
    expect(rangeView._objects.firstPin.element.onmouseup).toBeNull();
    expect(rangeView._objects.secondPin.element.onmousemove).toBeNull();
    expect(rangeView._objects.secondPin.element.onmouseup).toBeNull();
  });
});

describe('bindInputChange()', () => {
  beforeEach(() => {
    callback = jest.fn();
  });
  test('should bind onmousedown listener with the passed callback', () => {
    expect(defaultView._objects.input.element.onchange).toBeNull();
    defaultView.bindInputChange(callback);
    expect(defaultView._objects.input.element.onchange).toBeInstanceOf(Function);

    expect(rangeView._objects.input.element.onchange).toBeNull();
    rangeView.bindInputChange(callback);
    expect(rangeView._objects.input.element.onchange).toBeInstanceOf(Function);
  });
});

describe('applyToCorrectPin()', () => {
  beforeEach(() => {
    callback = jest.fn();
  });
  test('should correctly calculate correct pin', () => {
    expect(rangeView.applyToCorrectPin(50, callback)).toBe(0);
    expect(rangeView.applyToCorrectPin(70, callback)).toBe(1);
  });

  test('should run a callback for the chosen pin', () => {
    expect(rangeView.applyToCorrectPin(50, callback)).toBe(0);
    expect(rangeView.applyToCorrectPin(70, callback)).toBe(1);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('bindBarClick()', () => {
  beforeEach(() => {
    callback = jest.fn();
  });
  test('should call a callback on bar click', () => {
    defaultView.bindBarClick(callback);
    defaultView._objects.bar.element.click();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('bindScaleClick()', () => {
  beforeEach(() => {
    callback = jest.fn();
  });
  test('should call a callback on scale option click', () => {
    defaultView.bindScaleClick(callback);
    (defaultView._objects.scale.element.firstElementChild as HTMLElement).click();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('setState()', () => {
  beforeEach(() => {
    callback = jest.fn();
  });
  test('should merge current and new states', () => {
    defaultView.setState(
      {
        isVertical: true,
      },
      {
        step: 10,
      },
    );
    expect(defaultView._viewOptions).toStrictEqual({
      ...testOptions.normal.viewState,
      isVertical: true,
    });

    expect(defaultView._modelOptions).toStrictEqual({
      ...testOptions.normal.modelState,
      step: 10,
    });
  });
});
