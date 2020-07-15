import { boundMethod } from 'autobind-decorator';
import { DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE } from 'defaults';
import { Options } from 'types';

type Inputs = {
  isTooltipDisabled: HTMLInputElement;
  step: HTMLInputElement;
  minValue: HTMLInputElement;
  maxValue: HTMLInputElement;
  scaleOptionsNum: HTMLInputElement;
  firstValue: HTMLInputElement;
  secondValue: HTMLInputElement;
  isVertical: HTMLInputElement;
  range: HTMLInputElement;
};

class ControlPanel {
  inputs!: Inputs;
  slider!: HTMLElement;

  constructor(private element: HTMLElement, private initialOptions: Options) {
    this.findElements();
    this.setInitialValues();
    this.bindListeners();
  }

  private findElements(): void {
    const { element } = this;
    this.inputs = {
      isTooltipDisabled: element.querySelector('.js-tooltip-checkbox') as HTMLInputElement,
      step: element.querySelector('.js-step') as HTMLInputElement,
      minValue: element.querySelector('.js-min-value') as HTMLInputElement,
      maxValue: element.querySelector('.js-max-value') as HTMLInputElement,
      scaleOptionsNum: element.querySelector('.js-scale') as HTMLInputElement,
      firstValue: element.querySelector('.js-first-value') as HTMLInputElement,
      secondValue: element.querySelector('.js-second-value') as HTMLInputElement,
      isVertical: element.querySelector('.js-direction') as HTMLInputElement,
      range: element.querySelector('.js-range') as HTMLInputElement,
    };

    this.slider = element.closest('.js-test')?.querySelector('.js-example') as HTMLElement;
  }

  private setInitialValues(): void {
    const { inputs, initialOptions } = this;
    inputs.isTooltipDisabled.checked = initialOptions.isTooltipDisabled || DEFAULT_VIEW_STATE.isTooltipDisabled;
    inputs.isVertical.checked = initialOptions.isVertical || DEFAULT_VIEW_STATE.isVertical;
    inputs.step.value = String(initialOptions.step);
    inputs.minValue.value = String(initialOptions.minValue);
    inputs.maxValue.value = String(initialOptions.maxValue);
    inputs.scaleOptionsNum.value = String(initialOptions.scaleOptionsNum);
    inputs.range.checked = Boolean(initialOptions.range);

    if (initialOptions.value) {
      inputs.firstValue.value = String(initialOptions.value[0] || DEFAULT_MODEL_STATE.value[0]);
      inputs.secondValue.value = String(initialOptions.value[1] || initialOptions.maxValue);
    }

    if (!initialOptions.range) {
      inputs.secondValue.disabled = true;
    }

    inputs.firstValue.setAttribute('data-value', String(initialOptions.value));
  }

  @boundMethod
  private getInputsState(): Options {
    const { inputs } = this;
    return {
      isTooltipDisabled: inputs.isTooltipDisabled.checked,
      step: Number(inputs.step.value),
      minValue: inputs.minValue.value !== '' ? Number(inputs.minValue.value) : undefined,
      maxValue: inputs.maxValue.value !== '' ? Number(inputs.maxValue.value) : undefined,
      scaleOptionsNum: inputs.scaleOptionsNum.value !== '' ? Number(inputs.scaleOptionsNum.value) : undefined,
      isVertical: inputs.isVertical.checked,
      range: inputs.range.checked,
      value: [inputs.firstValue.value, inputs.secondValue.value].map(el => Number(el)),
    };
  }

  @boundMethod
  private handlePanelChange(): void {
    const { slider, inputs, bindListeners, getInputsState } = this;

    const newOptions = getInputsState();
    const { minValue, maxValue, step } = newOptions;

    if (minValue !== undefined && maxValue !== undefined) {
      if (minValue === maxValue) {
        const correctMaxValue = minValue + 1;
        inputs.maxValue.value = String(correctMaxValue);
        newOptions.maxValue = correctMaxValue;
      }

      if (minValue > maxValue) {
        inputs.minValue.value = String(maxValue);
        inputs.maxValue.value = String(minValue);
      }

      if (step !== undefined) {
        const absoluteValue = Math.abs(maxValue - minValue);
        inputs.step.value = String(step < absoluteValue ? step : absoluteValue);
      }

      $(slider).slider('update', newOptions);
      bindListeners();
    }
  }

  @boundMethod
  private bindListeners(): void {
    const { inputs, slider, handlePanelChange, updateInputValue } = this;
    Object.values(inputs).forEach(input => {
      (input as HTMLInputElement).addEventListener('change', handlePanelChange);
    });

    $(slider).slider('onValueChange', updateInputValue);
  }

  @boundMethod
  private updateInputValue(value: number[]): void {
    const { slider, inputs } = this;

    const { range } = $(slider)
      .children()
      .first()
      .data();

    inputs.firstValue.value = String(value[0]);
    inputs.secondValue.value = String(value[1]);

    inputs.secondValue.disabled = !range;
  }
}

export default ControlPanel;
