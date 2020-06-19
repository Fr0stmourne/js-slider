import View from '../View';
import Model from '../Models';
import Controller from '.';
import { DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE } from '../defaults';
import { EventTypes } from '../types';

let controller: Controller;
let view: View;
let model: Model;
describe('Controller constructor', () => {
  beforeEach(() => {
    view = new View(DEFAULT_MODEL_STATE, DEFAULT_VIEW_STATE);
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
    controller.setUserCallback(userCallback);

    expect(controller.getUserCallback()).toStrictEqual(userCallback);
  });

  test('should run passed user callback on event emit', () => {
    const userCallback = jest.fn();
    controller.setUserCallback(userCallback);

    controller.model.emit(EventTypes.StateChanged, { value: 5 });

    expect(userCallback).toBeCalled();
  });
});
