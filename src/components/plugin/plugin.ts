/* eslint-disable fsd/split-conditionals */
import { keys } from 'ts-transformer-keys';

import View from './View';
import Model from './Model';
import Controller from './Controller';
import { Options, ModelState, ViewState, API } from './types';
import './slider.scss';

type ReturnType = JQuery<HTMLElement> | number | number[] | undefined;

declare global {
  interface JQuery {
    slider: (methodOrOptions?: Options | keyof API, params?: Function | Options | number[]) => ReturnType;
  }
}

function getModelState<T extends Options, K extends keyof ModelState>(options: T, keys: K[]): Partial<T> {
  const result: Partial<T> = {};
  return keys.reduce((acc, key) => {
    acc[key] = options[key];
    return acc;
  }, result);
}

function getViewState<T extends Options, K extends keyof ViewState>(options: T, keys: K[]): Partial<T> {
  const result: Partial<T> = {};
  return keys.reduce((acc, key) => {
    acc[key] = options[key];
    return acc;
  }, result);
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
        const newOptions = { ...options, sliderSize: (el.firstChild as HTMLElement).getBoundingClientRect() };
        const updatedViewState = getViewState({ ...newOptions }, keys<ViewState>());
        const updatedModelState = getModelState({ ...newOptions }, keys<ModelState>());

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
