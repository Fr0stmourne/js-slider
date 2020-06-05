import View from './Views/View/View';
import Model from './Models/Model';
import Controller from './Controller/Controller';
import { Options, ModelState, ViewState } from './types';

import './slider.scss';

declare global {
  interface JQuery {
    slider: (options?: Options | string) => JQuery;
  }
}

const DEFAULT_CONFIG: Options = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  defaultValue: 50,
  scaleOptionsNum: 5,
  isTooltipDisabled: false,
  isVertical: false,
};

const state: {
  model: ModelState;
  view: ViewState;
} = {
  model: null,
  view: null,
};

$.fn.slider = function(methodOrOptions: Options | string, ...params): any {
  interface API {
    log(): void;
    init(): void;
    update(value: number | number[]): void;
  }

  const pluginAPI: API = {
    log(): void {
      console.log('test API');
      return this;
    },
    update(value: number | number[]): void {},
    init(): JQuery {
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

      function setAppState(options: Options): void {
        state.model = {
          minValue: options.minValue || DEFAULT_CONFIG.minValue,
          maxValue: options.maxValue || DEFAULT_CONFIG.maxValue,
          step: options.step || DEFAULT_CONFIG.step,
          defaultValue: options.defaultValue || DEFAULT_CONFIG.defaultValue,
          range: Array.isArray(options.defaultValue || DEFAULT_CONFIG.defaultValue),
        };

        state.view = {
          scaleOptionsNum: options.scaleOptionsNum || DEFAULT_CONFIG.scaleOptionsNum,
          isTooltipDisabled: options.isTooltipDisabled || DEFAULT_CONFIG.isTooltipDisabled,
          isVertical: options.isVertical || DEFAULT_CONFIG.isVertical,
        };
      }

      setAppState({ ...(methodOrOptions as Options) });

      const validatedOptions = validateOptions({ ...(methodOrOptions as Options) });
      const model = new Model(state.model);
      const view = new View(state.view, state.model);
      new Controller(model, view);
      this.append(view.element);
      view.updateValue(model.getPluginConfig().defaultValue);
      return this;
    },
  };

  if (pluginAPI[methodOrOptions as keyof API]) {
    return pluginAPI[methodOrOptions as keyof API].apply(this, Array.prototype.slice.call(params, 1));
  } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
    return pluginAPI.init.apply(this, params);
  } else {
    $.error('Method ' + methodOrOptions + ' does not exist on $.slider');
  }
};
