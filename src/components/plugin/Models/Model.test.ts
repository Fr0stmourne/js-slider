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

describe('state setter', () => {
  beforeEach(() => {
    defaultModel = new Model(testOptions.normal);
    rangeModel = new Model(testOptions.range);
  });
  describe('should correctly update model value', () => {
    test('default case', () => {
      defaultModel.state = {
        value: 50,
      };
      expect(defaultModel.state.value).toBe(50);

      defaultModel.state = {
        value: 20,
      };
      expect(defaultModel.state.value).toBe(20);
    });

    test('range case', () => {
      rangeModel.state = {
        value: [50, 70],
      };
      expect(rangeModel.state.value).toStrictEqual([50, 70]);

      rangeModel.state = {
        value: [0, 100],
      };
      expect(rangeModel.state.value).toStrictEqual([0, 100]);
    });
  });

  describe('should replace newValue with a min/max value if newValue is not in the interval', () => {
    test('default case', () => {
      defaultModel.state = {
        value: 1000,
      };
      expect(defaultModel.state.value).toEqual(100);

      defaultModel.state = {
        value: -70,
      };
      expect(defaultModel.state.value).toEqual(-30);
    });

    test('range case', () => {
      rangeModel.state = {
        value: [-90, 70],
      };
      expect(rangeModel.state.value).toStrictEqual([0, 70]);

      rangeModel.state = {
        value: [0, 200],
      };
      expect(rangeModel.state.value).toStrictEqual([0, 100]);
    });
  });
  describe('should ceil the values if they are not multiples of the step value', () => {
    test('default case', () => {
      defaultModel.state = {
        value: 51,
      };
      expect(defaultModel.state.value).toEqual(55);
    });

    test('range case', () => {
      rangeModel.state = {
        value: [31, 77],
      };
      expect(rangeModel.state.value).toStrictEqual([32, 78]);
    });
  });
  test('should not set values for range model if min value > max value', () => {
    rangeModel.state = {
      value: [70, 30],
    };
    expect(rangeModel.state.value).toStrictEqual(testOptions.range.value);
  });
});

describe('state getter', () => {
  beforeEach(() => {
    defaultModel = new Model(testOptions.normal);
    rangeModel = new Model(testOptions.range);
  });

  test('should return options object', () => {
    expect(defaultModel.state).toEqual(testOptions.normal);
    expect(rangeModel.state).toEqual(testOptions.range);
  });
});
