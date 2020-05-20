import calculateValue from './calculateValue';

describe('calculateValue', () => {
  test('should throw an error if max value is less than min value', () => {
    expect(() => {
      calculateValue(0.3, 10, 0);
    }).toThrow(Error);
  });

  test('should throw an error if percentage is not in [0, 1] interval', () => {
    expect(() => {
      calculateValue(5, 0, 35);
    }).toThrow(Error);
  });

  test('should return correct value based on percentage', () => {
    expect(calculateValue(1, 1, 10)).toBe(10);
    expect(calculateValue(0.5, 0, 100)).toBe(50);
    expect(calculateValue(0, -50, 100)).toBe(-50);
    expect(calculateValue(0.25, -100, 30)).toBe(-67.5);
  });
});
