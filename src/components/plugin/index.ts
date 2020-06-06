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
    log(): void;
    init(): void;
    updateValue(value: number | number[]): void;
    updateViewState(viewState: ViewState): void;
    update(options: Options): void;
  }

  const pluginAPI: API = {
    log(): void {
      console.log('test API');
      return this;
    },
    updateValue(value: number | number[]): void {
      const model: Model = $(this).data().slider.model;
      model.setState({
        ...model.getState(),
        value,
      });
    },
    updateViewState(viewState: ViewState): void {
      const { view, model } = $(this).data().slider;
      const newState = { ...view._viewOptions, ...viewState };
      view.setViewOptions(newState);
      view.render();
      this.data().slider.connect();
      $(this)
        .children()
        .first()
        .replaceWith(view.element);
      view.updateValue(model.getState().value);
    },
    update(options: Options) {
      const { view, model } = $(this).data().slider;
      const updatedViewState = getViewState({ ...(options as Options) });
      const updatedModelState = getModelState({ ...(options as Options) });
      debugger;
      model.setState(updatedModelState);
      view.setState(updatedViewState, model.getState());
      view.render();
      console.log(this.data().slider);

      this.data().slider.connect();
      $(this)
        .children()
        .first()
        .replaceWith(view.element);
      view.updateValue(model.getState().value);
    },
    init(): JQuery {
      const viewState = getViewState({ ...(methodOrOptions as Options) });
      const modelState = getModelState({ ...(methodOrOptions as Options) });
      const model = new Model(modelState);
      const view = new View(viewState, modelState);
      $(this).data('slider', new Controller(model, view));
      this.append(view.element);
      view.updateValue(model.getState().value);
      return this;
    },
  };

  if (pluginAPI[methodOrOptions as keyof API]) {
    return pluginAPI[methodOrOptions as keyof API].apply(this, params);
  } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
    return pluginAPI.init.apply(this, params);
  } else {
    $.error('Method ' + methodOrOptions + ' does not exist on $.slider');
  }
};
