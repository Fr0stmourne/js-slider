import Model from './Model';
import { ModelState } from '../interfaces';

const testOptions: { normal: ModelState; range: ModelState } = {
  normal: {
    minValue: -30,
    maxValue: 100,
    step: 5,
    value: 45,
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

describe('setState()', () => {
  beforeEach(() => {
    defaultModel = new Model(testOptions.normal);
    rangeModel = new Model(testOptions.range);
  });
  describe('should correctly update model value', () => {
    test('default case', () => {
      defaultModel.setState({
        value: 50,
      });
      expect(defaultModel.state.value).toBe(50);

      defaultModel.setState({
        value: 20,
      });
      expect(defaultModel.state.value).toBe(20);
    });

    test('range case', () => {
      rangeModel.setState({
        value: [50, 70],
      });
      expect(rangeModel.state.value).toStrictEqual([50, 70]);

      rangeModel.setState({
        value: [0, 100],
      });
      expect(rangeModel.state.value).toStrictEqual([0, 100]);
    });
  });

  describe('should replace newValue with a min/max value if newValue is not in the interval', () => {
    test('default case', () => {
      defaultModel.setState({
        value: 1000,
      });
      expect(defaultModel.state.value).toEqual(100);

      defaultModel.setState({
        value: -70,
      });
      expect(defaultModel.state.value).toEqual(-30);
    });

    test('range case', () => {
      rangeModel.setState({
        value: [-90, 70],
      });
      expect(rangeModel.state.value).toStrictEqual([0, 70]);

      rangeModel.setState({
        value: [0, 200],
      });
      expect(rangeModel.state.value).toStrictEqual([0, 100]);
    });
  });
  describe('should ceil the values if they are not multiples of the step value', () => {
    test('default case', () => {
      defaultModel.setState({
        value: 51,
      });
      expect(defaultModel.state.value).toEqual(55);
    });

    test('range case', () => {
      rangeModel.setState({
        value: [31, 77],
      });
      expect(rangeModel.state.value).toStrictEqual([32, 78]);
    });
  });
  test('should not set values for range model if min value > max value', () => {
    rangeModel.setState({
      value: [70, 30],
    });
    expect(rangeModel.state.value).toStrictEqual(testOptions.range.value);
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

describe('bindSetState()', () => {
  beforeAll(() => {
    defaultModel = new Model(testOptions.normal);
    rangeModel = new Model(testOptions.range);
  });

  test('should store the passed function in the class property', () => {
    function testHandler(): void {
      console.log(123);
    }

    defaultModel.bindSetState(testHandler);
    expect(defaultModel._onStateChange).toEqual(testHandler);

    rangeModel.bindSetState(testHandler);
    expect(rangeModel._onStateChange).toEqual(testHandler);
  });
});
