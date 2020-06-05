import { Options, ScaleData } from '../../../types';
import render from '../../../utils/render/render';
import DefaultView from '../DefaultView/DefaultView';

export default class ScaleView extends DefaultView {
  scaleOptionsNum: number;
  isVertical: boolean;
  minValue: number;
  maxValue: number;
  constructor(options: ScaleData) {
    super();
    this.scaleOptionsNum = options.scaleOptionsNum;
    this.isVertical = options.isVertical;
    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.render();
  }

  onOptionClick(_value: number): void {
    //
  }

  render(): void {
    const { scaleOptionsNum, isVertical } = this;
    const options = new Array(scaleOptionsNum)
      .fill(null)
      .map(
        (el, index) => `<div class="slider-plugin__scale-option js-option">${this._calculateMilestone(index)}</div>`,
      );
    this._element = render(
      `
      <div class="slider-plugin__scale js-scale">
        ${isVertical ? options.reverse().join('') : options.join('')}
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

  _calculateMilestone(index: number): number {
    const { minValue, maxValue, scaleOptionsNum } = this;
    return minValue + Math.round((index * (maxValue - minValue)) / (scaleOptionsNum - 1));
  }
}
