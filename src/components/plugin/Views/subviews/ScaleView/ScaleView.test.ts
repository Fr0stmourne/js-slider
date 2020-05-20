import ScaleView from './ScaleView';

const options = {
  minValue: -30,
  maxValue: 100,
  step: 5,
  defaultValue: 45,
  scaleOptionsNum: 5,
};

const optionsWithParameter = {
  minValue: -30,
  maxValue: 100,
  step: 5,
  defaultValue: 45,
  scaleOptionsNum: 12,
};

describe('ScaleView', () => {
  test('should store HTML element as _element property', () => {
    const scale = new ScaleView(options);

    expect(scale.element).toBeInstanceOf(HTMLElement);
  });

  describe('should store correct number of scale milestones', () => {
    const scale = new ScaleView(options);
    const scaleWithParam = new ScaleView(optionsWithParameter);

    test('default case', () => {
      console.log(scale.element);

      expect(scale.element.querySelectorAll('.js-option').length).toBe(5);
    });

    test('parameter is passed', () => {
      expect(scaleWithParam.element.querySelectorAll('.js-option').length).toBe(12);
    });
  });
});
