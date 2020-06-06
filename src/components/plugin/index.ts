import View from './Views/View/View';
import Model from './Models/Model';
import Controller from './Controller/Controller';
import { Options, ModelState, ViewState } from './types';

import './slider.scss';

declare global {
  interface JQuery {
    slider: (options?: Options | string, ...params: any) => JQuery;
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

function getModelState(options: Options): ModelState {
  return {
    minValue: options.minValue || DEFAULT_CONFIG.minValue,
    maxValue: options.maxValue || DEFAULT_CONFIG.maxValue,
    step: options.step || DEFAULT_CONFIG.step,
    value: options.defaultValue || DEFAULT_CONFIG.defaultValue,
    range: Array.isArray(options.defaultValue || DEFAULT_CONFIG.defaultValue),
  };
}

function getViewState(options: Options): ViewState {
  return {
    scaleOptionsNum: options.scaleOptionsNum || DEFAULT_CONFIG.scaleOptionsNum,
    isTooltipDisabled: options.isTooltipDisabled || DEFAULT_CONFIG.isTooltipDisabled,
    isVertical: options.isVertical || DEFAULT_CONFIG.isVertical,
  };
}

$.fn.slider = function(methodOrOptions: Options | string, ...params: any): any {
  interface API {
    init(): void;
    updateValue(value: number | number[]): void;
    update(options: Options): void;
  }

  const pluginAPI: API = {
    updateValue(value: number | number[]): void {
      return this.each((index: number, el: HTMLElement) => {
        const { model } = $(el).data().slider;

        model.setState({
          ...model.getState(),
          value,
        });
      });
    },
    update(options: Options) {
      return this.each((index: number, el: HTMLElement) => {
        const { view, model } = $(el).data().slider;
        const updatedViewState = getViewState({ ...(options as Options) });
        const updatedModelState = getModelState({ ...(options as Options) });

        model.setState(updatedModelState);
        view.setState(updatedViewState, model.getState());
        view.render();

        $(el)
          .data()
          .slider.connect();

        $(el)
          .children()
          .first()
          .replaceWith(view.element);

        view.updateValue(model.getState().value);
      });
    },
    init(methodOrOptions = DEFAULT_CONFIG): JQuery {
      return this.each((index: number, el: HTMLElement) => {
        const viewState = getViewState({ ...(methodOrOptions as Options) });
        const modelState = getModelState({ ...(methodOrOptions as Options) });
        const model = new Model(modelState);
        const view = new View(viewState, modelState);
        $(el).data('slider', new Controller(model, view));
        el.append(view.element);
        view.updateValue(model.getState().value);
      });
    },
  };

  if (pluginAPI[methodOrOptions as keyof API]) {
    return pluginAPI[methodOrOptions as keyof API].apply(this, params);
  } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
    return pluginAPI.init.call(this, methodOrOptions);
  } else {
    $.error('Method ' + methodOrOptions + ' does not exist on $.slider');
  }
};
