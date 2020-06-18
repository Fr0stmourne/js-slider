import calculateValue from './calculateValue';

describe('calculateValue', () => {
  test('should throw an error if max value is less than min value', () => {
    expect(() => {
      calculateValue({ percentage: 0.3, minValue: 10, maxValue: 0 });
    }).toThrow(Error);
  });

  test('should throw an error if percentage is not in [0, 1] interval', () => {
    expect(() => {
      calculateValue({ percentage: 5, minValue: 0, maxValue: 35 });
    }).toThrow(Error);
  });

  test('should return correct value based on percentage', () => {
    expect(calculateValue({ percentage: 1, minValue: 1, maxValue: 10 })).toBe(10);
    expect(calculateValue({ percentage: 0.5, minValue: 0, maxValue: 100 })).toBe(50);
    expect(calculateValue({ percentage: 0, minValue: -50, maxValue: 100 })).toBe(-50);
    expect(calculateValue({ percentage: 0.25, minValue: -100, maxValue: 30 })).toBe(-67.5);
  });
});
