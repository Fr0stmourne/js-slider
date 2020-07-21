import { ModelState } from 'types';

import Model from '.';
import calculateSteps from './utils/calculateSteps';

const testOptions: { normal: ModelState; range: ModelState } = {
  normal: {
    minValue: -30,
    maxValue: 100,
    step: 5,
    steps: calculateSteps({ minValue: -30, maxValue: 100, step: 5 }),
    value: [45],
    range: false,
  },

  range: {
    minValue: 0,
    maxValue: 100,
    step: 2,
    steps: calculateSteps({ minValue: 0, maxValue: 100, step: 2 }),
    range: true,
    value: [6, 64],
  },
};

let defaultModel: Model;
let rangeModel: Model;

describe('constructor', () => {
  test('should correctly create model when options object is not passed', () => {
    const modelWithNoOptions = new Model();

    expect(modelWithNoOptions.getState().value).toStrictEqual([50, 100]);
  });
});

describe('setState', () => {
  beforeEach(() => {
    defaultModel = new Model(testOptions.normal);
    rangeModel = new Model(testOptions.range);
  });
  describe('should correctly update model value', () => {
    test('default case', () => {
      defaultModel.setState({
        value: [50],
      });
      expect(defaultModel.getState().value).toStrictEqual([50, 100]);

      defaultModel.setState({
        value: [20],
      });
      expect(defaultModel.getState().value).toStrictEqual([20, 100]);
    });

    test('range case', () => {
      rangeModel.setState({
        value: [50, 70],
      });
      expect(rangeModel.getState().value).toStrictEqual([50, 70]);

      rangeModel.setState({
        value: [0, 100],
      });
      expect(rangeModel.getState().value).toStrictEqual([0, 100]);
    });
  });

  describe('should replace newValue with a min/max value if newValue is not in the interval', () => {
    test('default case', () => {
      defaultModel.setState({
        value: [1000],
      });
      expect(defaultModel.getState().value).toStrictEqual([100, 100]);

      defaultModel.setState({
        value: [-70],
      });
      expect(defaultModel.getState().value).toStrictEqual([-30, 100]);
    });

    test('range case', () => {
      rangeModel.setState({
        value: [-90, 70],
      });
      expect(rangeModel.getState().value).toStrictEqual([0, 70]);

      rangeModel.setState({
        value: [0, 200],
      });
      expect(rangeModel.getState().value).toStrictEqual([0, 100]);
    });
  });
  describe('should round the values if they are not multiples of the step value', () => {
    test('default case', () => {
      defaultModel.setState({
        value: [51],
      });
      expect(defaultModel.getState().value).toStrictEqual([50, 100]);
    });

    test('range case', () => {
      rangeModel.setState({
        value: [31, 77],
      });
      expect(rangeModel.getState().value).toStrictEqual([30, 76]);
    });
  });

  test('should handle the case for range model when min value > max value', () => {
    rangeModel.setState({
      value: [70, 64],
    });
    expect(rangeModel.getState().value).toStrictEqual([62, 64]);
  });

  test('should handle the case when 2 values are equal', () => {
    rangeModel.setState({
      value: [34, 34],
    });
    expect(rangeModel.getState().value).toStrictEqual([32, 34]);
  });

  test('should handle the case when 2 values are equal (new second value is greater than the previous one', () => {
    rangeModel.setState({
      value: [6, 6],
    });
    expect(rangeModel.getState().value).toStrictEqual([6, 8]);
  });

  test('should handle undefined as new value', () => {
    defaultModel.setState({
      value: undefined,
    });
    expect(defaultModel.getState().value).toStrictEqual([45]);
  });
});

describe('getState()', () => {
  beforeEach(() => {
    defaultModel = new Model(testOptions.normal);
    rangeModel = new Model(testOptions.range);
  });

  test('should return options object', () => {
    expect(defaultModel.getState()).toEqual(testOptions.normal);
    expect(rangeModel.getState()).toEqual(testOptions.range);
  });
});
