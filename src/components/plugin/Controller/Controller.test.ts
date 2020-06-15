import View from '../Views/View/View';
import Model from '../Models/Model';
import Controller from './Controller';
import { DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE } from '../defaults';

jest.mock('../Views/View/View');

describe('Controller constructor', () => {
  test('should store passed model and view', () => {
    const view = new View(DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE);
    const model = new Model(DEFAULT_MODEL_STATE);
    const controller = new Controller(model, view);

    expect(controller.view).toEqual(view);
    expect(controller.model).toEqual(model);
  });
});
