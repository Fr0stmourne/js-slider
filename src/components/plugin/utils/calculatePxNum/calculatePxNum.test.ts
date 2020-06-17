import calculatePxNum from './calculatePxNum';

describe('calculatePxNum', () => {
  test('should throw an error if element size is negative', () => {
    expect(() => {
      calculatePxNum({ value: 1, minValue: 1, maxValue: 10, elementSize: -1 });
    }).toThrow(Error);
  });

  test('should throw an error if max value is less than min value', () => {
    expect(() => {
      calculatePxNum({ value: 10, minValue: 10, maxValue: 0, elementSize: 100 });
    }).toThrow(Error);
  });

  test('should throw an error if value is not in stated range', () => {
    expect(() => {
      calculatePxNum({ value: -5, minValue: 0, maxValue: 10, elementSize: 100 });
    }).toThrow(Error);
  });

  test('should return correct number of pixels', () => {
    expect(calculatePxNum({ value: 1, minValue: 1, maxValue: 10, elementSize: 300 })).toBe(0);
    expect(calculatePxNum({ value: -50, minValue: -100, maxValue: 100, elementSize: 300 })).toBe(75);
    expect(calculatePxNum({ value: -50, minValue: -200, maxValue: -50, elementSize: 300 })).toBe(300);
    expect(calculatePxNum({ value: 800, minValue: 0, maxValue: 1000, elementSize: 200 })).toBe(160);
  });
});
