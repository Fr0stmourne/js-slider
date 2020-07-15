import calculatePxValue from '.';

describe('calculatePxValue', () => {
  test('should throw an error if element size is negative', () => {
    expect(() => {
      calculatePxValue({ value: 1, minValue: 1, maxValue: 10, elementSize: -1 });
    }).toThrow(Error);
  });

  test('should throw an error if max value is less than min value', () => {
    expect(() => {
      calculatePxValue({ value: 10, minValue: 10, maxValue: 0, elementSize: 100 });
    }).toThrow(Error);
  });

  test('should throw an error if value is not in stated range', () => {
    expect(() => {
      calculatePxValue({ value: -5, minValue: 0, maxValue: 10, elementSize: 100 });
    }).toThrow(Error);
  });

  test('should return correct number of pixels', () => {
    expect(calculatePxValue({ value: 1, minValue: 1, maxValue: 10, elementSize: 300 })).toBe(0);
    expect(calculatePxValue({ value: -50, minValue: -100, maxValue: 100, elementSize: 300 })).toBe(75);
    expect(calculatePxValue({ value: -50, minValue: -200, maxValue: -50, elementSize: 300 })).toBe(300);
    expect(calculatePxValue({ value: 800, minValue: 0, maxValue: 1000, elementSize: 200 })).toBe(160);
  });
});
