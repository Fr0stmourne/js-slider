/* eslint-disable @typescript-eslint/no-use-before-define */
import { Options } from '../../components/plugin/types';
import { DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE } from '../../components/plugin/defaults';

const testOptions: {
  default: Options;
  vr: Options;
  r: Options;
  v: Options;
} = {
  default: {
    minValue: -33,
    maxValue: 103,
    step: 1,
    value: [72],
    scaleOptionsNum: 9,
    range: false,
  },
  vr: {
    minValue: -112,
    maxValue: 100,
    step: 8,
    value: [-56, 56],
    range: false,
    isVertical: true,
    scaleOptionsNum: 5,
  },
  r: {
    minValue: -33,
    maxValue: 100,
    step: 2,
    value: [29, 79],
    range: true,
    scaleOptionsNum: 5,
  },
  v: {
    minValue: 0,
    maxValue: 100,
    step: 7,
    value: [49],
    range: false,
    isVertical: true,
    scaleOptionsNum: 5,
  },
};

$('.js-example-default').slider(testOptions.default);
$('.js-example-vr').slider(testOptions.vr);
$('.js-example-r').slider(testOptions.r);
$('.js-example-v').slider(testOptions.v);

function createPanel(el: HTMLElement, initialOptions: Options): void {
  const element = el;

  type Inputs = {
    isTooltipDisabled: HTMLInputElement;
    step: HTMLInputElement;
    minValue: HTMLInputElement;
    maxValue: HTMLInputElement;
    scaleOptionsNum: HTMLInputElement;
    value: HTMLInputElement;
    isVertical: HTMLInputElement;
    range: HTMLInputElement;
  };

  const inputs: Inputs = {
    isTooltipDisabled: element.querySelector('.js-tooltip-checkbox') as HTMLInputElement,
    step: element.querySelector('.js-step') as HTMLInputElement,
    minValue: element.querySelector('.js-min-value') as HTMLInputElement,
    maxValue: element.querySelector('.js-max-value') as HTMLInputElement,
    scaleOptionsNum: element.querySelector('.js-scale') as HTMLInputElement,
    value: element.querySelector('.js-control-input') as HTMLInputElement,
    isVertical: element.querySelector('.js-direction') as HTMLInputElement,
    range: element.querySelector('.js-range') as HTMLInputElement,
  };

  function setInitialInputValues(initialOptions: Options): void {
    inputs.isTooltipDisabled.checked = initialOptions.isTooltipDisabled || DEFAULT_VIEW_STATE.isTooltipDisabled;
    inputs.isVertical.checked = initialOptions.isVertical || DEFAULT_VIEW_STATE.isVertical;
    inputs.step.value = String(initialOptions.step);
    inputs.minValue.value = String(initialOptions.minValue);
    inputs.maxValue.value = String(initialOptions.maxValue);
    inputs.scaleOptionsNum.value = String(initialOptions.scaleOptionsNum);
    inputs.range.checked = Boolean(initialOptions.range);
    inputs.value.value = initialOptions.range
      ? String(initialOptions.value)
      : String((initialOptions.value || DEFAULT_MODEL_STATE.value)[0]);

    inputs.value.setAttribute('data-value', String(initialOptions.value));
  }

  const slider = element.closest('.js-test')?.querySelector('.js-example') as HTMLElement;
  setInitialInputValues(initialOptions);

  function handlePanelChange(e: Event): void {
    const newOptions = getInputsState();
    $(slider).slider('update', newOptions);
    bindListeners(inputs);
  }

  function bindListeners(inputs: Inputs): void {
    Object.values(inputs).forEach(input => {
      (input as HTMLInputElement).addEventListener('change', handlePanelChange);
    });
    function updateInputValue(value: number[]): void {
      const range = $(slider)
        .children()
        .first()
        .data().range;

      inputs.value.value = String(range ? value : value[0]);
      inputs.value.setAttribute('data-value', String(value));
    }

    $(slider).slider('onValueChange', updateInputValue);
  }

  function getInputsState(): Options {
    const inputValue = inputs.value.getAttribute('data-value') || inputs.value.value;

    const state = {
      isTooltipDisabled: inputs.isTooltipDisabled.checked,
      step: Number(inputs.step.value),
      minValue: inputs.minValue.value !== '' ? Number(inputs.minValue.value) : undefined,
      maxValue: inputs.maxValue.value !== '' ? Number(inputs.maxValue.value) : undefined,
      scaleOptionsNum: inputs.scaleOptionsNum.value !== '' ? Number(inputs.scaleOptionsNum.value) : undefined,
      isVertical: inputs.isVertical.checked,
      range: inputs.range.checked,
      value: inputValue.split(',').map(el => Number(el)),
    };

    return state;
  }

  bindListeners(inputs);
}

Object.values(testOptions).forEach((options: Options, index) => {
  const panels = document.querySelectorAll('.js-control-panel');
  createPanel(panels[index] as HTMLElement, options);
});
