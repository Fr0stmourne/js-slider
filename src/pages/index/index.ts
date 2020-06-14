/* eslint-disable @typescript-eslint/no-use-before-define */
import { Options } from '../../components/plugin/interfaces';

const testOptions = {
  default: {
    minValue: -33,
    maxValue: 103,
    step: 5,
    value: 73,
    scaleOptionsNum: 6,
  },
  vr: {
    minValue: -112,
    maxValue: 100,
    step: 8,
    value: [-56, 56],
    isVertical: true,
    scaleOptionsNum: 5,
  },
  r: {
    minValue: -33,
    maxValue: 100,
    step: 2,
    value: [29, 80],
    scaleOptionsNum: 5,
  },
  v: {
    minValue: 0,
    maxValue: 100,
    step: 7,
    value: 49,
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

  const inputs = {
    isTooltipDisabled: element.querySelector('.js-tooltip-checkbox') as HTMLInputElement,
    step: element.querySelector('.js-step') as HTMLInputElement,
    minValue: element.querySelector('.js-min-value') as HTMLInputElement,
    maxValue: element.querySelector('.js-max-value') as HTMLInputElement,
    scaleOptionsNum: element.querySelector('.js-scale') as HTMLInputElement,
    value: element.querySelector('.js-control-input') as HTMLInputElement,
    isVertical: element.querySelector('.js-direction') as HTMLInputElement,
  };

  function setInitialInputValues(initialOptions: Options): void {
    inputs.isTooltipDisabled.checked = initialOptions.isTooltipDisabled;
    inputs.isVertical.checked = initialOptions.isVertical;
    inputs.step.value = String(initialOptions.step);
    inputs.minValue.value = String(initialOptions.minValue);
    inputs.maxValue.value = String(initialOptions.maxValue);
    inputs.scaleOptionsNum.value = String(initialOptions.scaleOptionsNum);
    inputs.value.value = String(initialOptions.value);
  }

  const slider = element.closest('.js-test').querySelector('.js-example');
  setInitialInputValues(initialOptions);

  function handlePanelChange(): void {
    const newOptions = getInputsState();
    $(slider).slider('update', newOptions);
    bindListeners(inputs);
  }

  function bindListeners(inputs: any): void {
    Object.values(inputs).forEach(input => {
      (input as HTMLInputElement).addEventListener('change', handlePanelChange);
    });
    function updateInputValue(value: number | number[]): void {
      inputs.value.value = value;
    }

    $(slider).slider('onValueChange', updateInputValue);
  }

  function getInputsState(): Options {
    return {
      isTooltipDisabled: inputs.isTooltipDisabled.checked,
      step: +inputs.step.value,
      minValue: inputs.minValue.value !== '' ? +inputs.minValue.value : undefined,
      maxValue: inputs.maxValue.value !== '' ? +inputs.maxValue.value : undefined,
      scaleOptionsNum: inputs.scaleOptionsNum.value !== '' ? +inputs.scaleOptionsNum.value : undefined,
      isVertical: inputs.isVertical.checked,
      value: inputs.value.value.includes(',') ? inputs.value.value.split(',').map(el => +el) : +inputs.value.value,
    };
  }

  bindListeners(inputs);
}

Object.values(testOptions).forEach((options, index) => {
  const panels = document.querySelectorAll('.js-control-panel');
  createPanel(panels[index] as HTMLElement, options);
});
