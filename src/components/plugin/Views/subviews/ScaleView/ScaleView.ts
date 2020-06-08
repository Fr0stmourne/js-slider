import { ScaleData } from '../../../interfaces';
import render from '../../../utils/render/render';
import DefaultView from '../DefaultView/DefaultView';

export default class ScaleView extends DefaultView {
  onOptionClick: Function;
  scaleOptionsNum: number;
  isVertical: boolean;
  step: number;
  minValue: number;
  maxValue: number;
  constructor(options: ScaleData) {
    super();
    this.scaleOptionsNum = options.scaleOptionsNum;
    this.isVertical = options.isVertical;
    this.minValue = options.minValue;
    this.step = options.step;
    this.maxValue = options.maxValue;
    this.render();
  }

  render(): void {
    const { scaleOptionsNum, isVertical, minValue, maxValue } = this;
    const options = new Array(scaleOptionsNum).fill(null);
    options[0] = minValue;
    options[options.length - 1] = maxValue;

    const calculatedOptions = options.map((el, index) => {
      if (el !== null) return el;
      return this._calculateMilestone(index);
    });
    const optionElements = calculatedOptions.map(
      el => `<div class="slider-plugin__scale-option js-option">${el}</div>`,
    );
    this._element = render(
      `
      <div class="slider-plugin__scale js-scale">
        ${isVertical ? optionElements.reverse().join('') : optionElements.join('')}
      </div>
      `,
    );

    const handleOptionClick = (e: Event): void => {
      if ((e.target as HTMLElement).classList.contains('js-option')) {
        e.stopPropagation();
        this.onOptionClick(+(e.target as HTMLElement).textContent);
      }
    };

    this._element.querySelectorAll('.js-option').forEach(el => {
      el.addEventListener('click', handleOptionClick);
    });
  }

  private _calculateMilestone(index: number): number {
    const { minValue, maxValue, scaleOptionsNum, step } = this;
    return Math.round((minValue + Math.round((index * (maxValue - minValue)) / (scaleOptionsNum - 1))) / step) * step;
  }
}
