import View from '../Views/View/View';
import Model from '../Models/Model';
import Controller from './Controller';
import { DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE } from '../defaults';
import { EventTypes } from '../types';

let controller: Controller;
let view: View;
let model: Model;
describe('Controller constructor', () => {
  beforeEach(() => {
    view = new View(DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE);
    model = new Model(DEFAULT_MODEL_STATE);
    controller = new Controller(model, view);
  });
  test('should store passed model and view', () => {
    expect(controller.view).toEqual(view);
    expect(controller.model).toEqual(model);
  });
});

describe('setUserCallback', () => {
  test('should store passed user callback', () => {
    const userCallback = jest.fn();
    controller.userCallback = userCallback;

    expect(controller.userCallback).toStrictEqual(userCallback);
  });

  test('should run passed user callback on event emit', () => {
    const userCallback = jest.fn();
    controller.userCallback = userCallback;

    controller.model.emit(EventTypes.StateChanged, { value: 5 });

    expect(userCallback).toBeCalled();
  });
});
