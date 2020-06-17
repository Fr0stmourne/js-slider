import ScaleView from './ScaleView';
import { ScaleData } from '../../../interfaces';

const options: ScaleData = {
  minValue: -30,
  maxValue: 100,
  isVertical: false,
  step: 5,
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

  test('should correct place nodes in vertical case', () => {
    expect(vScale.element.firstElementChild.textContent.trim()).toBe('100');
  });
});
