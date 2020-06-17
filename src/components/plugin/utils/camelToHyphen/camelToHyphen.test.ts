import camelToHyphen from './camelToHyphen';

describe('calculateSteps()', () => {
  test('should correctly change notation', () => {
    expect(camelToHyphen('maxValue')).toBe('max-value');
  });

  test('should handle several words cases', () => {
    expect(camelToHyphen('maxValue anotherValue')).toBe('max-value another-value');
  });
});
