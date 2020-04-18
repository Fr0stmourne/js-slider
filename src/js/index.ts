import View from './Views/View';
import Model from './Models/Model';
import Controller from './Controller/Controller';
declare global {
  interface JQuery {
    slider: (options ?:object) => void;
  }
}

const testOptions = {
  minValue: 0,
  maxValue: 100,
  step: 2,
  defaultValue: 30,
  isTooltipEnabled: true,
}

$.fn.slider = function (options: object) {
  const model = new Model(testOptions);
  const view = new View(model.getPluginConfig());
  const controller = new Controller(model, view)  
  $(this).append(view.element)

  return this;
}


$('#root').slider();