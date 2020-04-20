import View from './Views/View';
import Model from './Models/Model';
import Controller from './Controller/Controller';
declare global {
  interface JQuery {
    slider: (options?: object) => void;
  }
}

const testOptions1 = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  defaultValue: 60,
};

const testOptions2 = {
  minValue: 0,
  maxValue: 100,
  step: 2,
  defaultValue: [42, 88],
  isVertical: true,
  range: true,
};

const testOptions3 = {
  minValue: 0,
  maxValue: 100,
  step: 5,
  defaultValue: [20, 90],
  range: true,
};
const testOptions4 = {
  minValue: 0,
  maxValue: 100,
  step: 7,
  defaultValue: 45,
  isVertical: true,
};

$.fn.slider = function(options: object) {
  const model = new Model(options);
  const view = new View(model.getPluginConfig());
  const controller = new Controller(model, view);
  $(this).append(view.element);

  return this;
};

$('#example-1').slider(testOptions1);
$('#example-2').slider(testOptions2);
$('#example-3').slider(testOptions3);
$('#example-4').slider(testOptions4);

$(() => {
  function change(val: number) {
    (<any>$('#root-1 input')).val(String(val));
    (<any>$('#root-1 input')).change();
  }

  function changeRange(values: number[]) {
    (<any>$('#root input')).val(String(values.join(' ')));
    (<any>$('#root input')).change();
  }

  // setTimeout(() => {
  //   change(11);
  //   changeRange([25, 70]);
  // }, 1000)
});
