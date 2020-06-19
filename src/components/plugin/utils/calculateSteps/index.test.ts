import calculateSteps from './index';

describe('calculateSteps()', () => {
  test('should correctly calculate steps', () => {
    const minValue = 0;
    const maxValue = 100;
    const step = 25;

    expect(calculateSteps({ minValue, maxValue, step })).toStrictEqual([0, 25, 50, 75, 100]);
  });

  test('should correctly handle case when min/max value is not multiple of the step', () => {
    const minValue = -1;
    const maxValue = 100;
    const step = 25;

    expect(calculateSteps({ minValue, maxValue, step })).toStrictEqual([-1, 24, 49, 74, 99, 100]);
  });
});
