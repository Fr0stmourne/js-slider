import 'webpack-jquery-ui';

import View from './Views/View/View';
import Model from './Models/Model';
import Controller from './Controller/Controller';
import Options from './types';
declare global {
  interface JQuery {
    slider: (options?: Options) => JQuery;
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

$.fn.slider = function(options: Options): JQuery {
  function validateOptions(options: Options): Options {
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
