import View from './Views/View/View';
import Model from './Models/Model';
import Controller from './Controller/Controller';
declare global {
  interface JQuery {
    slider: (options?: object) => JQuery;
    newSlider: (options?: object) => JQuery;
  }
}

const testOptions2 = {
  minValue: -100,
  maxValue: 100,
  step: 2,
  defaultValue: [-100, 100],
  isVertical: true,
};

const testOptions3 = {
  minValue: -33,
  maxValue: 100,
  step: 2,
  defaultValue: [30, 80],
};
const testOptions4 = {
  minValue: 0,
  maxValue: 100,
  step: 7,
  defaultValue: 45,
  isVertical: true,
};

const testOptions1 = {
  minValue: -33,
  maxValue: 103,
  step: 2,
  defaultValue: 75,
  scaleOptionsNum: 5,
};

$.fn.slider = function(options: any): JQuery {
  const model = new Model(options);
  const view = new View(model.getPluginConfig());
  new Controller(model, view);
  this.append(view.element);
  view.updateValue(options.defaultValue);
  return this;
};

$('#example-1').slider(testOptions1);
$('#example-2').slider(testOptions2);
$('#example-3').slider(testOptions3);
$('#example-4').slider(testOptions4);

// $('#example-1').newSlider(testOptions1);

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

  //
  function handleInitialChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    console.log('trigger');

    (target.closest('.test').querySelector('.control-panel input') as HTMLInputElement).value = target.value;
  }

  document.querySelectorAll('.example input').forEach(input => {
    input.addEventListener('change', handleInitialChange);
  });
});
