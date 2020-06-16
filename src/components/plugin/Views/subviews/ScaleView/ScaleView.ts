import { ScaleData } from '../../../interfaces';
import render from '../../../utils/render/render';
import DefaultView from '../DefaultView/DefaultView';
import calculatePxNum from '../../../utils/calculatePxNum/calculatePxNum';
import calculateSteps from '../../../utils/calculateSteps/calculateSteps';

export default class ScaleView extends DefaultView {
  handleOptionClick: (value: number) => void;
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

    const calculatedOptions = this._getMilestones();

    const optionPositions = calculatedOptions.map(value => {
      return calculatePxNum({ value, minValue, maxValue, elementSize: sliderSize });
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
      const target = e.target as HTMLElement;
      if (!target.classList.contains('js-option')) return;
      this.handleOptionClick(Number(target.textContent));
    };

    this._element.querySelectorAll('.js-option').forEach(el => {
      el.addEventListener('click', handleOptionClick);
    });
  }

  private _getMilestones(): number[] {
    const { minValue, maxValue, scaleOptionsNum, step } = this;
    const steps = calculateSteps({ minValue, maxValue, step });

    function filterSteps(steps: number[], scaleOptionsNum: number): number[] {
      if (scaleOptionsNum >= steps.length) {
        return [...steps];
      }
      const result: number[] = [];
      const totalItems = steps.length;
      const interval = totalItems / scaleOptionsNum;

      for (let i = 0; i < scaleOptionsNum; i++) {
        const evenIndex = Math.floor(i * interval + interval / 2);
        result.push(steps[evenIndex]);
      }

      result.pop();
      result.shift();
      result.unshift(steps[0]);
      result.push(steps[steps.length - 1]);
      return result;
    }

    const filteredSteps = filterSteps(steps, scaleOptionsNum);
    return filteredSteps;
  }
}
