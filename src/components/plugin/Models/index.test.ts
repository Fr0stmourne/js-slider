import Model from '.';
import { ModelState } from '../types';

const testOptions: { normal: ModelState; range: ModelState } = {
  normal: {
    minValue: -30,
    maxValue: 100,
    step: 5,
    value: [45],
    range: false,
  },

  range: {
    minValue: 0,
    maxValue: 100,
    step: 2,
    range: true,
    value: [6, 64],
  },
};

let defaultModel: Model;
let rangeModel: Model;

describe('state setter', () => {
  beforeEach(() => {
    defaultModel = new Model(testOptions.normal);
    rangeModel = new Model(testOptions.range);
  });
  describe('should correctly update model value', () => {
    test('default case', () => {
      defaultModel.setState({
        value: [50],
      });
      expect(defaultModel.getState().value).toStrictEqual([50]);

      defaultModel.setState({
        value: [20],
      });
      expect(defaultModel.getState().value).toStrictEqual([20]);
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
      expect(defaultModel.getState().value).toStrictEqual([100]);

      defaultModel.setState({
        value: [-70],
      });
      expect(defaultModel.getState().value).toStrictEqual([-30]);
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
      expect(defaultModel.getState().value).toStrictEqual([50]);
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
});

describe('state getter', () => {
  beforeEach(() => {
    defaultModel = new Model(testOptions.normal);
    rangeModel = new Model(testOptions.range);
  });

  test('should return options object', () => {
    expect(defaultModel.getState()).toEqual(testOptions.normal);
    expect(rangeModel.getState()).toEqual(testOptions.range);
  });
});
