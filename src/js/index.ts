/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable fsd/no-function-declaration-in-event-listener */
import View from './Views/View/View';
import Model from './Models/Model';
import Controller from './Controller/Controller';
import 'webpack-jquery-ui';
declare global {
  interface JQuery {
    slider: (options?: object) => JQuery;
  }
}

const DEFAULT_CONFIG = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  defaultValue: 50,
  scaleOptionsNum: 5,
  isTooltipDisabled: false,
  isVertical: false,
};

const testOptions2 = {
  minValue: -101,
  maxValue: 100,
  step: 8,
  defaultValue: [-50, 50],
  isVertical: true,
  scaleOptionsNum: 5,
};

const testOptions3 = {
  minValue: -33,
  maxValue: 100,
  step: 2,
  defaultValue: [30, 80],
  scaleOptionsNum: 5,
};
const testOptions4 = {
  minValue: 0,
  maxValue: 100,
  step: 7,
  defaultValue: 45,
  isVertical: true,
  scaleOptionsNum: 5,
};

const testOptions1 = {
  minValue: -33,
  maxValue: 103,
  step: 5,
  defaultValue: 75,
  scaleOptionsNum: 5,
};

$.fn.slider = function(options: any): JQuery {
  function validateOptions(options: any): object {
    return {
      minValue: options.minValue || DEFAULT_CONFIG.minValue,
      maxValue: options.maxValue || DEFAULT_CONFIG.maxValue,
      step: options.step || DEFAULT_CONFIG.step,
      defaultValue: options.defaultValue || DEFAULT_CONFIG.defaultValue,
      scaleOptionsNum: options.scaleOptionsNum || DEFAULT_CONFIG.scaleOptionsNum,
      isTooltipDisabled: options.isTooltipDisabled || DEFAULT_CONFIG.isTooltipDisabled,
      isVertical: options.isVertical || DEFAULT_CONFIG.isVertical,
    };
  }

  const validatedOptions = validateOptions({ ...options });
  const model = new Model(validatedOptions);
  const view = new View(model.getPluginConfig());
  new Controller(model, view);
  this.append(view.element);
  view.updateValue(model.getPluginConfig().defaultValue);
  return this;
};

$('#example-1').slider(testOptions1);
$('#example-2').slider(testOptions2);
$('#example-3').slider(testOptions3);
$('#example-4').slider(testOptions4);

$(() => {
  function change(el: HTMLElement, val: number): void {
    $(el).val(String(val));
    $(el).change();
  }
  function changeRange(el: HTMLElement, values: number[]): void {
    $(el).val(String(values.join(',')));
    $(el).change();
  }

  function handleChange(e: Event): void {
    const newValue = +(e.target as HTMLInputElement).value;
    change((e.target as HTMLElement).closest('.test').querySelector('.example input'), newValue);
  }

  function handleRangeChange(e: Event): void {
    const newValue = (e.target as HTMLInputElement).value.split(',').map(el => +el.trim());
    changeRange((e.target as HTMLElement).closest('.test').querySelector('.example input'), newValue);
  }

  function handleInitialChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    (target.closest('.test').querySelector('.control-panel input') as HTMLInputElement).value = target.value;
  }

  function handleControlPanelChange(e: Event, initialOptions: any): void {
    const target = e.target as HTMLInputElement;
    const element = target.closest('.control-panel');

    const inputs = {
      isTooltipDisabled: element.querySelector('.js-tooltip-checkbox') as HTMLInputElement,
      step: element.querySelector('.js-step') as HTMLInputElement,
      minValue: element.querySelector('.js-min-value') as HTMLInputElement,
      maxValue: element.querySelector('.js-max-value') as HTMLInputElement,
      scaleOptionsNum: element.querySelector('.js-scale') as HTMLInputElement,
    };

    const inputsState = {
      isTooltipDisabled: inputs.isTooltipDisabled.checked,
      step: inputs.step.value || initialOptions.step,
      minValue: inputs.minValue.value !== '' ? +inputs.minValue.value : initialOptions.minValue,
      maxValue: inputs.maxValue.value !== '' ? +inputs.maxValue.value : initialOptions.maxValue,
      scaleOptionsNum:
        inputs.scaleOptionsNum.value !== '' ? +inputs.scaleOptionsNum.value : initialOptions.scaleOptionsNum,
    };

    const slider = target.closest('.test').querySelector('.example');
    slider.textContent = '';

    $(slider).slider({ ...initialOptions, ...inputsState });
    bindListeners();
  }

  function bindListeners(): void {
    document.querySelectorAll('.js-control-input-range').forEach(input => {
      (input as HTMLInputElement).value = (input
        .closest('.test')
        .querySelector('.example input') as HTMLInputElement).value;
      input.addEventListener('change', handleRangeChange);
    });

    document.querySelectorAll('.js-control-input').forEach(input => {
      (input as HTMLInputElement).value = (input
        .closest('.test')
        .querySelector('.example input') as HTMLInputElement).value;
      input.addEventListener('change', handleChange);
    });

    document.querySelectorAll('.example input').forEach(input => {
      input.addEventListener('blur', handleInitialChange);
    });

    document
      .querySelectorAll('.test-1 .control-panel input:not(.js-control-input):not(.js-control-input-range)')
      .forEach(input => {
        input.addEventListener('change', e => handleControlPanelChange(e, testOptions1));
      });
    document
      .querySelectorAll('.test-2 .control-panel input:not(.js-control-input):not(.js-control-input-range)')
      .forEach(input => {
        input.addEventListener('change', e => handleControlPanelChange(e, testOptions2));
      });
    document
      .querySelectorAll('.test-3 .control-panel input:not(.js-control-input):not(.js-control-input-range)')
      .forEach(input => {
        input.addEventListener('change', e => handleControlPanelChange(e, testOptions3));
      });
    document
      .querySelectorAll('.test-4 .control-panel input:not(.js-control-input):not(.js-control-input-range)')
      .forEach(input => {
        input.addEventListener('change', e => handleControlPanelChange(e, testOptions4));
      });
  }

  bindListeners();
});
