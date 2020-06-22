import { ScaleData, EventTypes } from 'types';
import render from 'View/utils/render';
import calculatePxNum from 'View/utils/calculatePxNum';
import DefaultView from '../DefaultView';

class ScaleView extends DefaultView {
  scaleOptionsNum: number;
  isVertical: boolean;
  steps: number[];
  minValue: number;
  maxValue: number;
  sliderSize: number;
  constructor(options: ScaleData) {
    super();
    this.scaleOptionsNum = options.scaleOptionsNum;
    this.isVertical = options.isVertical;
    this.minValue = options.minValue;
    this.steps = options.steps;
    this.maxValue = options.maxValue;
    this.sliderSize = options.sliderSize;
    this.render();
  }

  render(): void {
    const { scaleOptionsNum, isVertical, minValue, maxValue, sliderSize } = this;
    const options = new Array(scaleOptionsNum).fill(null);
    options[0] = minValue;
    options[options.length - 1] = maxValue;

    const calculatedOptions = this.getMilestones();

    const optionPositions = calculatedOptions.map(value => {
      return calculatePxNum({ value, minValue, maxValue, elementSize: sliderSize });
    });

    const optionNodes = calculatedOptions.map((el, index) => {
      const optionNode = render(`<div class="slider-plugin__scale-option js-option">${el}</div>`);
      optionNode.style[isVertical ? 'bottom' : 'left'] = `${(optionPositions[index] / sliderSize) * 100}%`;
      return optionNode;
    });
    this.element = render(
      `
      <div class="slider-plugin__scale js-scale">
      </div>
      `,
    );
    if (isVertical) {
      optionNodes.reverse().forEach(node => this.element.append(node));
    } else {
      optionNodes.forEach(node => this.element.append(node));
    }

    this.element.append();

    const handleOptionClick = (e: Event): void => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (!target.classList.contains('js-option')) return;
      this.emit(EventTypes.NewScaleValue, { value: Number(target.textContent) });
    };

    this.element.querySelectorAll('.js-option').forEach(el => {
      el.addEventListener('click', handleOptionClick);
    });
  }

  private getMilestones(): number[] {
    const { scaleOptionsNum, steps } = this;

    function filterSteps(steps: number[], scaleOptionsNum: number): number[] {
      if (scaleOptionsNum >= steps.length) {
        return [...steps];
      }

      const interval = steps.length / scaleOptionsNum;
      const result = Array(Math.floor(scaleOptionsNum))
        .fill(null)
        .reduce((acc: number[], el: number, index: number) => {
          acc.push(steps[Math.floor(index * interval + interval / 2)]);
          return acc;
        }, [])
        .slice(1, -1);

      result.unshift(steps[0]);
      result.push(steps[steps.length - 1]);
      return result;
    }

    const filteredSteps = filterSteps(steps, scaleOptionsNum);
    return filteredSteps;
  }
}

export default ScaleView;
