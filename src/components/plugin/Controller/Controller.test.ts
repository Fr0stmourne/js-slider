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

  test('should call binders on the view', () => {
    const view = new View(DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE);
    const model = new Model(DEFAULT_MODEL_STATE);
    expect(view.bindMovePin).not.toHaveBeenCalled();
    expect(view.bindInputChange).not.toHaveBeenCalled();
    expect(view.bindScaleClick).not.toHaveBeenCalled();
    expect(view.bindBarClick).not.toHaveBeenCalled();

    new Controller(model, view);
    expect(view.bindMovePin).toHaveBeenCalled();
    expect(view.bindInputChange).toHaveBeenCalled();
    expect(view.bindScaleClick).toHaveBeenCalled();
    expect(view.bindBarClick).toHaveBeenCalled();
  });

  test('should bind _onStateChange handler to the model', () => {
    const view = new View(DEFAULT_VIEW_STATE, DEFAULT_MODEL_STATE);
    const model = new Model(DEFAULT_MODEL_STATE);
    expect(model.onStateChange).not.toBeInstanceOf(Function);

    new Controller(model, view);
    expect(model.onStateChange).toBeInstanceOf(Function);
  });
});
