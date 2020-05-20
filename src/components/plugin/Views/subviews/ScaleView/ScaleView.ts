import Options from '../../../types';
import render from '../../../utils/render/render';
import DefaultView from '../DefaultView/DefaultView';

export default class ScaleView extends DefaultView {
  _options: Options;
  constructor(options: Options) {
    super();
    this._options = options;
    this.render();
  }

  onOptionClick(_value: number): void {
    //
  }

  render(): void {
    const scaleOptionsNum = this._options.scaleOptionsNum;
    const options = new Array(scaleOptionsNum)
      .fill(null)
      .map(
        (el, index) =>
          `<div class="slider-plugin__scale-option js-option">${this._calculateMilestone(
            index,
            scaleOptionsNum,
          )}</div>`,
      );
    this._element = render(
      `
      <div class="slider-plugin__scale js-scale">
        ${this._options.isVertical ? options.reverse().join('') : options.join('')}
      </div>
      `,
    );

    const handleOptionClick = (e: Event): void => {
      this.onOptionClick(+(e.target as HTMLElement).textContent);
    };

    this._element.querySelectorAll('.js-option').forEach(el => {
      el.addEventListener('click', handleOptionClick);
    });
  }

  _calculateMilestone(index: number, scaleOptionsNum: number): number {
    return (
      this._options.minValue +
      Math.round((index * (this._options.maxValue - this._options.minValue)) / (scaleOptionsNum - 1))
    );
  }
}
