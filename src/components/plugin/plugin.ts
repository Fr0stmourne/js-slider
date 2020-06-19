import deleteUndef from './utils/deleteUndef';
import View from './View';
import Model from './Models';
import Controller from './Controller';
import { Options, ModelState, ViewState } from './types';
import { DEFAULT_CONFIG } from './defaults';
import './slider.scss';

declare global {
  interface JQuery {
    slider: (options?: Options | string, ...params: any) => void;
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
    sliderSize: options.sliderSize,
  };

  deleteUndef(state);
  return state;
}

$.fn.slider = function(methodOrOptions?: string | Options, ...params: any) {
  interface API {
    init(this: JQuery, methodOrOptions: Options): JQuery;
    updateValue(value: number | number[]): void;
    update(options: Options): void;
    onValueChange(callback: Function): void;
    getValue(): number | number[];
  }

  const pluginAPI: API = {
    updateValue(value: number | number[]): void {
      return this.each((_: number, el: HTMLElement) => {
        const slider: Controller = $(el).data().slider;
        slider.value = value;
      });
    },
    update(options: Options) {
      return this.each((_: number, el: HTMLElement) => {
        const controller: Controller = $(el).data().slider;
        const newOptions = { ...options, sliderSize: (el.firstChild as HTMLElement).getBoundingClientRect() };
        const updatedViewState = getViewState({
          ...newOptions,
        });
        const updatedModelState = getModelState({ ...newOptions });

        controller.modelState = updatedModelState;
        controller.setViewState(updatedViewState, controller.modelState);
        controller.render();
        controller.connect();

        $(el)
          .children()
          .first()
          .replaceWith(controller.element);

        controller.value = controller.modelState.value;
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
    init(this: JQuery, methodOrOptions: Options): JQuery {
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
