import { ViewState, ModelState, EventTypes, EventCallback } from 'types';

import calculateSteps from '../Model/utils/calculateSteps';
import View from '.';

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
      container: document.createElement('div'),
    },
    modelState: {
      minValue: -30,
      maxValue: 100,
      step: 5,
      steps: calculateSteps({ minValue: -30, maxValue: 100, step: 5 }),
      value: [45],
      range: false,
    },
  },

  vertical: {
    viewState: {
      isTooltipDisabled: false,
      isVertical: true,
      scaleOptionsNum: 5,
      container: document.createElement('div'),
    },
    modelState: {
      minValue: -30,
      maxValue: 100,
      step: 5,
      steps: calculateSteps({ minValue: -30, maxValue: 100, step: 5 }),
      value: [45],
      range: false,
    },
  },

  range: {
    viewState: {
      isTooltipDisabled: true,
      isVertical: false,
      scaleOptionsNum: 10,
      container: document.createElement('div'),
    },
    modelState: {
      minValue: 0,
      maxValue: 100,
      step: 1,
      steps: calculateSteps({ minValue: 0, maxValue: 100, step: 1 }),
      value: [45, 75],
      range: true,
    },
  },
};

let callback: EventCallback;

let defaultView: View, verticalView: View, rangeView: View;
beforeEach(() => {
  defaultView = new View(testOptions.normal.modelState, testOptions.normal.viewState);
  verticalView = new View(testOptions.vertical.modelState, testOptions.vertical.viewState);
  rangeView = new View(testOptions.range.modelState, testOptions.range.viewState);
});

describe('View constructor', () => {
  test('should return HTMLElement instance as view.element', () => {
    expect(defaultView.getElement()).toBeInstanceOf(HTMLElement);
    expect(verticalView.getElement()).toBeInstanceOf(HTMLElement);
    expect(rangeView.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('should correctly handle case when view options object is not passed', () => {
    const noOptionsView = new View(testOptions.normal.modelState);

    expect(noOptionsView.getState().modelState.value).toStrictEqual([45]);
  });
});

describe('Update value()', () => {
  test('should correctly update pin value', () => {
    defaultView.updateValue([100]);
    expect(defaultView.getObjects().firstPin.getValue()).toBe(100);
    expect(defaultView.getState().modelState.value).toStrictEqual([100]);

    verticalView.updateValue([-30]);
    expect(verticalView.getObjects().firstPin.getValue()).toBe(-30);
    expect(verticalView.getState().modelState.value).toStrictEqual([-30]);

    rangeView.updateValue([30, 50]);
    expect(rangeView.getObjects().firstPin.getValue()).toBe(30);
    expect(rangeView.getObjects().secondPin?.getValue()).toBe(50);
    expect(rangeView.getState().modelState.value).toStrictEqual([30, 50]);
  });

  test('should throw an error if the passed value is not correct', () => {
    expect(() => {
      defaultView.updateValue([120]);
    }).toThrow(Error);
    expect(() => {
      verticalView.updateValue([-1000]);
    }).toThrow(Error);
    expect(() => {
      rangeView.updateValue([-900, -700]);
    }).toThrow(Error);
  });

  test('should update hidden input.element', () => {
    defaultView.updateValue([50]);
    expect((defaultView.getObjects().input.element as HTMLInputElement).value).toBe('50');

    verticalView.updateValue([30]);
    expect((verticalView.getObjects().input.element as HTMLInputElement).value).toBe('30');

    rangeView.updateValue([50, 70]);
    expect((rangeView.getObjects().input.element as HTMLInputElement).value).toBe('50,70');
  });
});

describe('render()', () => {
  beforeEach(() => {
    callback = jest.fn();
    defaultView.on(EventTypes.ValueChanged, callback);
    rangeView.on(EventTypes.ValueChanged, callback);
  });
  describe('should bind callbacks to needed slider objects', () => {
    test('bar', () => {
      const objects = defaultView.getObjects();
      objects.bar.element.dispatchEvent(new Event('mousedown'));
      expect(callback).toBeCalled();
    });

    test('bar: range case', () => {
      const objects = rangeView.getObjects();
      objects.bar.element.dispatchEvent(new Event('mousedown'));
      expect(callback).toBeCalled();
    });

    test('scale', () => {
      const objects = defaultView.getObjects();
      const scaleOption = objects.scale?.element.firstElementChild as HTMLElement;
      if (scaleOption) {
        scaleOption.click();
        expect(callback).toBeCalled();
      }
    });

    test('pin', () => {
      const objects = defaultView.getObjects();
      objects.firstPin.element.dispatchEvent(new Event('mousedown'));
      document.dispatchEvent(new Event('mousemove'));
      document.dispatchEvent(new Event('mouseup'));
      expect(callback).toBeCalled();
    });

    test('pin: range case', () => {
      const objects = rangeView.getObjects();
      objects.firstPin.element.dispatchEvent(new Event('mousedown'));
      document.dispatchEvent(new Event('mousemove'));
      document.dispatchEvent(new Event('mouseup'));
      expect(callback).toBeCalled();
    });
  });
});
