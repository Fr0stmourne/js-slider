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
      sliderSize: {
        bottom: 93,
        height: 5,
        left: 361,
        right: 661,
        top: 88,
        width: 300,
        x: 361,
        y: 88,
      } as DOMRect,
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
    expect(defaultView.objects.firstPin.value).toBe(100);
    expect(defaultView.state.modelState.value).toBe(100);

    verticalView.updateValue(-30);
    expect(verticalView.objects.firstPin.value).toBe(-30);
    expect(verticalView.state.modelState.value).toBe(-30);

    rangeView.updateValue([30, 50]);
    expect(rangeView.objects.firstPin.value).toBe(30);
    expect(rangeView.objects.secondPin.value).toBe(50);
    expect(rangeView.state.modelState.value).toStrictEqual([30, 50]);
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
    expect((defaultView.objects.input.element as HTMLInputElement).value).toBe('50');

    verticalView.updateValue(30);
    expect((verticalView.objects.input.element as HTMLInputElement).value).toBe('30');

    rangeView.updateValue([50, 70]);
    expect((rangeView.objects.input.element as HTMLInputElement).value).toBe('50,70');
  });
});

describe('bindInputChange()', () => {
  beforeEach(() => {
    callback = jest.fn();
  });
  test('should bind onmousedown listener with the passed callback', () => {
    expect(defaultView.objects.input.element.onchange).toBeNull();
    defaultView.bindInputChange(callback);
    expect(defaultView.objects.input.element.onchange).toBeInstanceOf(Function);

    expect(rangeView.objects.input.element.onchange).toBeNull();
    rangeView.bindInputChange(callback);
    expect(rangeView.objects.input.element.onchange).toBeInstanceOf(Function);
  });
});

describe('bindBarClick()', () => {
  beforeEach(() => {
    callback = jest.fn();
  });
  test('should call a callback on bar mousedown evt', () => {
    defaultView.bindBarClick(callback);
    defaultView.objects.bar.element.dispatchEvent(new Event('mousedown'));
    expect(callback).toHaveBeenCalledTimes(1);
  });
  test('should call a callback on bar mousedown evt for range case', () => {
    rangeView.bindBarClick(callback);
    rangeView.objects.bar.element.dispatchEvent(new Event('mousedown'));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('bindScaleClick()', () => {
  beforeEach(() => {
    callback = jest.fn();
  });
  test('should call a callback on scale option click', () => {
    defaultView.bindScaleClick(callback);
    if (defaultView.objects.scale) {
      (defaultView.objects.scale.element.firstElementChild as HTMLElement).click();
      expect(callback).toHaveBeenCalledTimes(1);
    }

    rangeView.bindScaleClick(callback);
    if (rangeView.objects.scale) {
      (rangeView.objects.scale.element.firstElementChild as HTMLElement).click();
      expect(callback).toHaveBeenCalledTimes(1);

      (rangeView.objects.scale.element.lastElementChild as HTMLElement).click();
      expect(callback).toHaveBeenCalledTimes(2);
    }
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
    expect(defaultView.state.viewState).toStrictEqual({
      ...testOptions.normal.viewState,
      isVertical: true,
    });

    expect(defaultView.state.modelState).toStrictEqual({
      ...testOptions.normal.modelState,
      step: 10,
    });
  });
});
