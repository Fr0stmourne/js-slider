import DefaultView from '../DefaultView/DefaultView';
import render from '../../../utils/render/render';

const DEFAULT_OPTIONS_NUM = 5;

export default class ScaleView extends DefaultView {
  _options: {
    minValue: number;
    maxValue: number;
    isVertical?: boolean;
    scaleOptionsNum?: number;
  };
  constructor(options: any) {
    super();
    this._options = options;
    this._options.scaleOptionsNum = options.scaleOptionsNum || DEFAULT_OPTIONS_NUM;
    this.render();
  }

  _calculateMilestone(index: number, scaleOptionsNum: number): number {
    return (
      this._options.minValue +
      Math.round((index * (this._options.maxValue - this._options.minValue)) / (scaleOptionsNum - 1))
    );
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
}
