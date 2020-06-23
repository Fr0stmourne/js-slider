/* eslint-disable fsd/split-conditionals */
import { Options, ModelState, ViewState, API } from 'types';
import { DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE } from 'defaults';

import View from './View';
import Model from './Model';
import Controller from './Controller';
import './slider.scss';

type ReturnType = JQuery<HTMLElement> | number | number[] | undefined;

declare global {
  interface JQuery {
    slider: (methodOrOptions?: Options | keyof API, params?: Function | Options | number[]) => ReturnType;
  }
}

function getProps(options: Options, target: ViewState): Partial<ViewState>;
function getProps(options: Options, target: ModelState): Partial<ModelState>;
function getProps(options: Options, target: ViewState | ModelState): Partial<ModelState> | Partial<ViewState> {
  const state: Partial<ViewState | ModelState> = {};
  const keys = Object.keys(target) as Array<keyof typeof target>;
  return keys.reduce((acc, key) => {
    if (options[key] !== undefined) {
      acc[key] = options[key];
    }
    return acc;
  }, state);
}

$.fn.slider = function(methodOrOptions, params): ReturnType {
  const pluginAPI = {
    updateValue(this: JQuery, { value }: { value: number[] }): JQuery<HTMLElement> {
      return this.each((_: number, el: HTMLElement) => {
        const slider: Controller = $(el).data().slider;
        slider.value = value;
      });
    },
    update(this: JQuery, options: Options): JQuery<HTMLElement> {
      return this.each((_: number, el: HTMLElement) => {
        const controller: Controller = $(el).data().slider;
        const newOptions: Options = { ...options, container: el };
        const updatedViewState = getProps({ ...newOptions }, DEFAULT_VIEW_STATE);
        const updatedModelState = getProps({ ...newOptions }, DEFAULT_MODEL_STATE);

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
    } else if (methodOrOptions === 'updateValue' && params && params instanceof Array) {
      return pluginAPI[methodOrOptions].call(this, { value: params });
    } else if (methodOrOptions === 'update' && params && !(params instanceof Function || params instanceof Array)) {
      return pluginAPI[methodOrOptions].call(this, params);
    }
  }

  if (typeof methodOrOptions === 'object') {
    return pluginAPI.init.call(this, methodOrOptions);
  }

  $.error(`Method ${methodOrOptions} does not exist on $.slider`);
};
