import View from './View';
import Model from './Models';
import Controller from './Controller';
import { Options, ModelState, ViewState, API } from './types';
import './slider.scss';
import { DEFAULT_MODEL_STATE, DEFAULT_VIEW_STATE } from './defaults';

declare global {
  interface JQuery {
    slider: (options?: Options | keyof API, ...params: any) => JQuery<HTMLElement> | number | number[] | undefined;
  }
}

function getModelState(options: Options): Partial<ModelState> {
  const state: {
    [key: string]: any;
  } = {};
  Object.keys(options).forEach(option => {
    if (Object.keys(DEFAULT_MODEL_STATE).includes(option)) state[option] = options[option as keyof ModelState];
  });
  return state;
}

function getViewState(options: Options): ViewState {
  const state: {
    [key: string]: any;
  } = {};
  Object.keys(options).forEach(option => {
    if (Object.keys(DEFAULT_VIEW_STATE).includes(option)) state[option] = options[option as keyof ViewState];
  });
  return state;
}

$.fn.slider = function(methodOrOptions, ...params) {
  const pluginAPI: API = {
    updateValue(this: JQuery, value: number | number[]): JQuery {
      return this.each((_: number, el: HTMLElement) => {
        const slider: Controller = $(el).data().slider;
        slider.value = value;
      });
    },
    update(this: JQuery, options: Options) {
      return this.each((_: number, el: HTMLElement) => {
        const controller: Controller = $(el).data().slider;
        const newOptions = { ...options, sliderSize: (el.firstChild as HTMLElement).getBoundingClientRect() };
        const updatedViewState = getViewState({
          ...newOptions,
        });
        const updatedModelState = getModelState({ ...newOptions });

        controller.setModelState(updatedModelState);
        controller.setViewState(updatedViewState, controller.getModelState());
        controller.render();
        controller.connect();

        $(el)
          .children()
          .first()
          .replaceWith(controller.element);

        controller.value = controller.getModelState().value;
      });
    },
    onValueChange(this: JQuery, callback: Function): JQuery {
      return this.each((_: number, el: HTMLElement) => {
        const slider: Controller = $(el).data().slider;
        slider.setUserCallback(callback);
      });
    },
    getValue() {
      return $(this).data().slider.value;
    },
    init(this: JQuery, methodOrOptions?: Options): JQuery {
      return this.each((_: number, el: HTMLElement) => {
        const model = new Model();
        const view = new View(model.getState());
        const controller = new Controller(model, view);

        $(el).data('slider', controller);
        el.append($(el).data('slider').element);
        $(el).slider('update', {
          ...methodOrOptions,
        });
      });
    },
  };

  if (pluginAPI[methodOrOptions as keyof API]) {
    return pluginAPI[methodOrOptions as keyof API].apply(this, params);
  } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
    return pluginAPI.init.call(this, methodOrOptions);
  } else {
    $.error(`Method ${methodOrOptions} does not exist on $.slider`);
  }
};
