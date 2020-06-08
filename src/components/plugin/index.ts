import View from './Views/View/View';
import Model from './Models/Model';
import Controller from './Controller/Controller';
import { Options, ModelState, ViewState } from './interfaces';

import { DEFAULT_CONFIG } from './defaults';
import deleteUndef from './utils/deleteUndef/deleteUndef';
import './slider.scss';

declare global {
  interface JQuery {
    slider: (options?: Options | string, ...params: any) => JQuery;
  }
}

function getModelState(options: Options): ModelState {
  const state: ModelState = {
    minValue: options.minValue,
    maxValue: options.maxValue,
    step: options.step,
    value: options.value,
    range: options.value ? Array.isArray(options.value) : undefined,
  };
  deleteUndef(state);
  return state;
}

function getViewState(options: Options): ViewState {
  const state: ViewState = {
    scaleOptionsNum: options.scaleOptionsNum,
    isTooltipDisabled: options.isTooltipDisabled,
    isVertical: options.isVertical,
  };

  deleteUndef(state);
  return state;
}

$.fn.slider = function(methodOrOptions: string | Options, ...params: any): JQuery {
  interface API {
    init(): void;
    updateValue(value: number | number[]): void;
    update(options: Options): void;
    onValueChange(callback: Function): void;
    getValue(): number | number[];
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
    onValueChange(callback: Function): JQuery {
      return this.each((index: number, el: HTMLElement) => {
        $(el).data().slider.model.userCallback = callback;
      });
    },
    getValue() {
      return $(this)
        .data()
        .slider.model.getState().value;
    },
    init(methodOrOptions = DEFAULT_CONFIG): JQuery {
      return this.each((index: number, el: HTMLElement) => {
        const viewState = getViewState(DEFAULT_CONFIG);
        const modelState = getModelState(DEFAULT_CONFIG);
        const model = new Model(modelState);
        const view = new View(viewState, modelState);
        $(el).data('slider', new Controller(model, view));
        el.append(view.element);
        $(el).slider('update', { ...(methodOrOptions as Options) });
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
