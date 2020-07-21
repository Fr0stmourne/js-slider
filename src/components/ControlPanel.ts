import { boundMethod } from 'autobind-decorator';
import { DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE } from 'defaults';
import { Options } from 'types';

import './controlPanel.scss';

type Inputs = {
  isTooltipDisabled: HTMLInputElement;
  step: HTMLInputElement;
  minValue: HTMLInputElement;
  maxValue: HTMLInputElement;
  milestonesNumber: HTMLInputElement;
  firstValue: HTMLInputElement;
  secondValue: HTMLInputElement;
  isVertical: HTMLInputElement;
  range: HTMLInputElement;
  progress: HTMLInputElement;
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
      isTooltipDisabled: element.querySelector('.control-panel__tooltip') as HTMLInputElement,
      step: element.querySelector('.control-panel__step') as HTMLInputElement,
      minValue: element.querySelector('.control-panel__min-value') as HTMLInputElement,
      maxValue: element.querySelector('.control-panel__max-value') as HTMLInputElement,
      milestonesNumber: element.querySelector('.control-panel__milestones') as HTMLInputElement,
      firstValue: element.querySelector('.control-panel__first-value') as HTMLInputElement,
      secondValue: element.querySelector('.control-panel__second-value') as HTMLInputElement,
      isVertical: element.querySelector('.control-panel__direction') as HTMLInputElement,
      range: element.querySelector('.control-panel__range') as HTMLInputElement,
      progress: element.querySelector('.control-panel__progress') as HTMLInputElement,
    };

    this.slider = element.closest('.js-test')?.querySelector('.js-example') as HTMLElement;
  }

  private setInitialValues(): void {
    const {
      inputs,
      initialOptions: {
        isTooltipDisabled,
        isVertical,
        step,
        minValue,
        maxValue,
        milestonesNumber,
        range,
        value,
        showProgress,
      },
    } = this;
    inputs.isTooltipDisabled.checked = isTooltipDisabled || DEFAULT_VIEW_STATE.isTooltipDisabled;
    inputs.isVertical.checked = isVertical || DEFAULT_VIEW_STATE.isVertical;
    inputs.step.value = String(step);
    inputs.minValue.value = String(minValue);
    inputs.maxValue.value = String(maxValue);
    inputs.milestonesNumber.value = String(milestonesNumber);
    inputs.range.checked = Boolean(range);
    inputs.progress.checked = Boolean(showProgress || DEFAULT_VIEW_STATE.showProgress);

    if (value) {
      inputs.firstValue.value = String(value[0] || DEFAULT_MODEL_STATE.value[0]);
      inputs.secondValue.value = String(value[1] || maxValue);
    }

    if (!range) {
      inputs.secondValue.disabled = true;
    }

    inputs.firstValue.setAttribute('data-value', String(value));
  }

  @boundMethod
  private getInputsState(): Options {
    const {
      inputs: {
        isTooltipDisabled,
        step,
        minValue,
        maxValue,
        milestonesNumber,
        isVertical,
        range,
        progress,
        firstValue,
        secondValue,
      },
    } = this;
    const MINIMAL_MILESTONES_NUMBER = 2;
    return {
      isTooltipDisabled: isTooltipDisabled.checked,
      step: Number(step.value),
      minValue: minValue.value !== '' ? Number(minValue.value) : undefined,
      maxValue: maxValue.value !== '' ? Number(maxValue.value) : undefined,
      milestonesNumber:
        milestonesNumber.value !== '' ? Math.max(Number(milestonesNumber.value), MINIMAL_MILESTONES_NUMBER) : undefined,
      isVertical: isVertical.checked,
      range: range.checked,
      showProgress: progress.checked,
      value: [firstValue.value, secondValue.value].map(el => Number(el)),
    };
  }

  @boundMethod
  synchronizeInputs(): void {
    const { inputs } = this;
    const { step, minValue, maxValue, steps, milestonesNumber } = $(this.slider)
      .children()
      .first()
      .data();

    inputs.step.value = step;
    inputs.minValue.value = String(minValue);
    inputs.maxValue.value = String(maxValue);
    inputs.milestonesNumber.value = String(Math.min(steps.split(',').length, milestonesNumber));
  }

  @boundMethod
  private handlePanelChange(): void {
    const { slider, bindListeners, getInputsState, synchronizeInputs } = this;

    const newOptions = getInputsState();

    $(slider).slider('update', newOptions);
    synchronizeInputs();
    bindListeners();
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
