const testOptionsDefault = {
  minValue: -33,
  maxValue: 103,
  step: 5,
  defaultValue: 75,
  scaleOptionsNum: 5,
};

const testOptionsVerticalRange = {
  minValue: -101,
  maxValue: 100,
  step: 8,
  defaultValue: [-50, 50],
  isVertical: true,
  scaleOptionsNum: 5,
};

const testOptionsRange = {
  minValue: -33,
  maxValue: 100,
  step: 2,
  defaultValue: [30, 80],
  scaleOptionsNum: 5,
};
const testOptionsVertical = {
  minValue: 0,
  maxValue: 100,
  step: 7,
  defaultValue: 45,
  isVertical: true,
  scaleOptionsNum: 5,
};

$('.js-example-default').slider(testOptionsDefault);
$('.js-example-vr').slider(testOptionsVerticalRange);
$('.js-example-r').slider(testOptionsRange);
$('.js-example-v').slider(testOptionsVertical);

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
  console.log(newValue);

  change((e.target as HTMLElement).closest('.js-test').querySelector('.js-example .js-input'), newValue);
}

function handleRangeChange(e: Event): void {
  const newValue = (e.target as HTMLInputElement).value.split(',').map(el => +el.trim());
  console.log((e.target as HTMLInputElement).value);
  changeRange((e.target as HTMLElement).closest('.js-test').querySelector('.js-example .js-input'), newValue);
}

function handleSliderChange(e: Event): void {
  const target = e.target as HTMLInputElement;
  (target.closest('.js-test').querySelector('.js-control-panel input') as HTMLInputElement).value = target.value;
}

function handleControlPanelChange(e: Event, initialOptions: any): void {
  const target = e.target as HTMLInputElement;
  const element = target.closest('.js-control-panel');

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

  const slider = target.closest('.js-test').querySelector('.js-example');
  slider.textContent = '';

  $(slider).slider({ ...initialOptions, ...inputsState });
  bindListeners();
}

function bindListeners(): void {
  document.querySelectorAll('.js-control-input-range').forEach(input => {
    (input as HTMLInputElement).value = (input
      .closest('.js-test')
      .querySelector('.js-example .js-input') as HTMLInputElement).value;
    input.addEventListener('change', handleRangeChange);
  });

  document.querySelectorAll('.js-control-input').forEach(input => {
    (input as HTMLInputElement).value = (input
      .closest('.js-test')
      .querySelector('.js-example .js-input') as HTMLInputElement).value;
    input.addEventListener('change', handleChange);
  });

  document.querySelectorAll('.js-example .js-input').forEach(input => {
    input.addEventListener('blur', handleSliderChange);
  });

  document.querySelectorAll('.js-test-default .js-secondary').forEach(input => {
    input.addEventListener('change', e => handleControlPanelChange(e, testOptionsDefault));
  });
  document.querySelectorAll('.js-test-vr .js-secondary').forEach(input => {
    input.addEventListener('change', e => handleControlPanelChange(e, testOptionsVerticalRange));
  });
  document.querySelectorAll('.js-test-r .js-secondary').forEach(input => {
    input.addEventListener('change', e => handleControlPanelChange(e, testOptionsRange));
  });
  document.querySelectorAll('.js-test-v .js-secondary').forEach(input => {
    input.addEventListener('change', e => handleControlPanelChange(e, testOptionsVertical));
  });
}

bindListeners();
