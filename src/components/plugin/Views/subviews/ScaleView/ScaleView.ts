import { ScaleData } from '../../../interfaces';
import render from '../../../utils/render/render';
import DefaultView from '../DefaultView/DefaultView';
import calculatePxNum from '../../../utils/calculatePxNum/calculatePxNum';

export default class ScaleView extends DefaultView {
  onOptionClick: Function;
  scaleOptionsNum: number;
  isVertical: boolean;
  step: number;
  minValue: number;
  maxValue: number;
  sliderSize: number;
  constructor(options: ScaleData) {
    super();
    this.scaleOptionsNum = options.scaleOptionsNum;
    this.isVertical = options.isVertical;
    this.minValue = options.minValue;
    this.step = options.step;
    this.maxValue = options.maxValue;
    this.sliderSize = options.sliderSize;
    this.render();
  }

  render(): void {
    const { scaleOptionsNum, isVertical, minValue, maxValue, sliderSize } = this;
    const options = new Array(scaleOptionsNum).fill(null);
    options[0] = minValue;
    options[options.length - 1] = maxValue;

    const calculatedOptions = options.map((el, index) => {
      if (el !== null) return el;
      return this._calculateMilestone(index);
    });

    const optionPositions = calculatedOptions.map(value => {
      return calculatePxNum(value, minValue, maxValue, sliderSize);
    });

    const optionNodes = calculatedOptions.map((el, index) => {
      const optionNode = render(`<div class="slider-plugin__scale-option js-option">${el}</div>`);
      optionNode.style[isVertical ? 'bottom' : 'left'] = `${optionPositions[index]}px`;
      return optionNode;
    });
    this._element = render(
      `
      <div class="slider-plugin__scale js-scale">
      </div>
      `,
    );
    if (isVertical) {
      optionNodes.reverse().forEach(node => this._element.append(node));
    } else {
      optionNodes.forEach(node => this._element.append(node));
    }

    this._element.append();

    const handleOptionClick = (e: Event): void => {
      e.stopPropagation();
      if (!(e.target as HTMLElement).classList.contains('js-option')) {
        return;
      }

      this.onOptionClick(+(e.target as HTMLElement).textContent);
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
