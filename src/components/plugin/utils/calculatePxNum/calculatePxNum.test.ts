import calculatePxNum from './calculatePxNum';

describe('calculatePxNum', () => {
  test('should throw an error if element size is negative', () => {
    expect(() => {
      calculatePxNum(1, 1, 10, -1);
    }).toThrow(Error);
  });

  test('should throw an error if max value is less than min value', () => {
    expect(() => {
      calculatePxNum(10, 10, 0, 100);
    }).toThrow(Error);
  });

  test('should throw an error if value is not in stated range', () => {
    expect(() => {
      calculatePxNum(-5, 0, 10, 100);
    }).toThrow(Error);
  });

  test('should return correct number of pixels', () => {
    expect(calculatePxNum(1, 1, 10, 300)).toBe(0);
    expect(calculatePxNum(-50, -100, 100, 300)).toBe(75);
    expect(calculatePxNum(-50, -200, -50, 300)).toBe(300);
    expect(calculatePxNum(800, 0, 1000, 200)).toBe(160);
  });
});
