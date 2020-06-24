import { DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE } from 'defaults';

import View from '../View';
import Model from '../Model';
import Controller from '.';

let controller: Controller;
let view: View;
let model: Model;

beforeEach(() => {
  view = new View(DEFAULT_MODEL_STATE, DEFAULT_VIEW_STATE);
  model = new Model(DEFAULT_MODEL_STATE);
  controller = new Controller(model, view);
});

describe('setUserCallback', () => {
  test('should store passed user callback', () => {
    const userCallback = jest.fn();
    controller.setUserCallback(userCallback);

    expect(controller.getUserCallback()).toStrictEqual(userCallback);
  });
});

describe('getModelState', () => {
  test('should return model state', () => {
    expect(controller.getModelState()).toStrictEqual(model.getState());
  });
});

describe('getViewState', () => {
  test('should return view state', () => {
    expect(controller.getViewState()).toStrictEqual(view.getState().viewState);
  });
});

describe('setModelState', () => {
  test('should set model state', () => {
    controller.setModelState({
      value: [20],
    });
    expect(controller.getModelState().value).toStrictEqual([20, 100]);
  });
});

describe('setViewState', () => {
  test('should set view state', () => {
    controller.setViewState(
      {
        isVertical: true,
      },
      controller.getModelState(),
    );
    expect(controller.getViewState()).toStrictEqual({ ...DEFAULT_VIEW_STATE, isVertical: true });
  });
});

describe('get/set value', () => {
  test('should correctly set and return value', () => {
    controller.setValue([70]);
    expect(controller.getModelState().value).toStrictEqual([70, 100]);
  });
});
