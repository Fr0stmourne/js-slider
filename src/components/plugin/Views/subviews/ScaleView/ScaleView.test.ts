import ScaleView from './ScaleView';
import { ScaleData } from '../../../interfaces';

const options: ScaleData = {
  minValue: -30,
  maxValue: 100,
  isVertical: false,
  step: 5,
  scaleOptionsNum: 12,
};

describe('ScaleView', () => {
  let scale: ScaleView;

  beforeEach(() => {
    scale = new ScaleView(options);
  });

  test('should store HTML element as .element property', () => {
    expect(scale.element).toBeInstanceOf(HTMLElement);
  });

  test('should store correct number of scale milestones', () => {
    expect(scale.element.querySelectorAll('.js-option').length).toBe(12);
  });
});
