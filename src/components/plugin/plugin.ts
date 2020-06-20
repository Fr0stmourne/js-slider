import View from './View';
import Model from './Models';
import Controller from './Controller';
import { Options, ModelState, ViewState, API } from './types';
import './slider.scss';
import { DEFAULT_MODEL_STATE, DEFAULT_VIEW_STATE } from './defaults';

declare global {
  interface JQuery {
    slider: (
      methodOrOptions?: Options | keyof API,
      params?: Function | Options | Required<Pick<Options, 'value'>>,
    ) => JQuery<HTMLElement> | number | number[] | undefined;
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

function getViewState(options: Options): Partial<ViewState> {
  const state: {
    [key: string]: any;
  } = {};
  Object.keys(options).forEach(option => {
    if (Object.keys(DEFAULT_VIEW_STATE).includes(option)) state[option] = options[option as keyof ViewState];
  });
  return state;
}

$.fn.slider = function(methodOrOptions, params) {
  const pluginAPI = {
    updateValue(this: JQuery, { value }: { value: number | number[] }): JQuery<HTMLElement> {
      return this.each((_: number, el: HTMLElement) => {
        const slider: Controller = $(el).data().slider;
        slider.value = value;
      });
    },
    update(this: JQuery, options: Options): JQuery<HTMLElement> {
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
    onValueChange(this: JQuery, callback: Function): JQuery<HTMLElement> {
      return this.each((_: number, el: HTMLElement) => {
        const slider: Controller = $(el).data().slider;
        slider.setUserCallback(callback);
      });
    },
    init(this: JQuery, methodOrOptions?: Options): JQuery<HTMLElement> {
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

  if (typeof methodOrOptions === 'string') {
    if (methodOrOptions === 'onValueChange' && params instanceof Function) {
      return pluginAPI[methodOrOptions].call(this, params);
    } else if (methodOrOptions === 'updateValue' && params) {
      return pluginAPI[methodOrOptions].call(this, params as Required<Pick<Options, 'value'>>);
    } else if (methodOrOptions === 'update' && params) {
      return pluginAPI[methodOrOptions].call(this, params as Options);
    }
  }

  if (typeof methodOrOptions === 'object') {
    return pluginAPI.init.call(this, methodOrOptions);
  }

  $.error(`Method ${methodOrOptions} does not exist on $.slider`);
};
