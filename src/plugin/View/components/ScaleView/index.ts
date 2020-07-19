import { EventTypes } from 'types';
import calculatePxValue from 'View/utils/calculatePxValue';
import render from 'View/utils/render';

import DefaultView from '../DefaultView';

class ScaleView extends DefaultView {
  constructor(
    private milestonesNumber: number,
    private isVertical: boolean,
    private steps: number[],
    private minValue: number,
    private maxValue: number,
    private sliderSize: number,
  ) {
    super();

    this.render();
  }

  render(): void {
    const { milestonesNumber, isVertical, minValue, maxValue, sliderSize } = this;
    const options = new Array(milestonesNumber).fill(null);
    options[0] = minValue;
    options[options.length - 1] = maxValue;

    const calculatedOptions = this.getMilestones();

    const optionPositions = calculatedOptions.map(value => {
      return calculatePxValue({ value, minValue, maxValue, elementSize: sliderSize });
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
      this.emit(EventTypes.NewScaleValue, { value: Number(target.textContent) });
    };

    this.element.querySelectorAll('.js-option').forEach(el => {
      el.addEventListener('click', handleOptionClick);
    });
  }

  private getMilestones(): number[] {
    const { milestonesNumber, steps } = this;

    function filterSteps(steps: number[], milestonesNumber: number): number[] {
      if (milestonesNumber >= steps.length) {
        return [...steps];
      }

      const interval = steps.length / milestonesNumber;
      const result = Array(Math.floor(milestonesNumber))
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

    const filteredSteps = filterSteps(steps, milestonesNumber);
    return filteredSteps;
  }
}

export default ScaleView;
