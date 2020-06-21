import { ScaleData, EventTypes } from 'types';
import ScaleView from '.';
import calculateSteps from 'Model/utils/calculateSteps';

const options: ScaleData = {
  minValue: -30,
  maxValue: 100,
  isVertical: false,
  steps: calculateSteps({ minValue: -30, maxValue: 100, step: 5 }),
  scaleOptionsNum: 12,
  sliderSize: 300,
};

const verticalOptions: ScaleData = { ...options, isVertical: true };

describe('ScaleView', () => {
  let scale: ScaleView;
  let vScale: ScaleView;

  beforeEach(() => {
    scale = new ScaleView(options);
    vScale = new ScaleView(verticalOptions);
  });

  test('should store HTML element as .element property', () => {
    expect(scale.element).toBeInstanceOf(HTMLElement);
  });

  test('should store correct number of scale milestones', () => {
    expect(scale.element.querySelectorAll('.js-option').length).toBe(12);
  });

  test('should not react on click between scale milestones', () => {
    const callback = jest.fn();
    scale.on(EventTypes.NewScaleValue, callback);

    (scale.element as HTMLElement).click();
    expect(callback).not.toHaveBeenCalled();
  });

  test('should run the passed callback on a scale milestone click', () => {
    const callback = jest.fn();
    scale.on(EventTypes.NewScaleValue, callback);

    (scale.element.querySelector('.js-option') as HTMLElement).click();
    expect(callback).toHaveBeenCalled();
  });

  test('should correct place nodes in vertical case', () => {
    expect(vScale.element.firstElementChild?.textContent?.trim()).toBe('100');
  });
});
