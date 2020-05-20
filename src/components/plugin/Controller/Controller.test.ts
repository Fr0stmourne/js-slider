import View from '../Views/View/View';
import Model from '../Models/Model';
import Options from '../types';
import Controller from './Controller';

jest.mock('../Views/View/View');

const testOptions: { normal: Options; range: Options } = {
  normal: {
    minValue: -30,
    maxValue: 100,
    step: 5,
    defaultValue: 45,
  },

  range: {
    minValue: 0,
    maxValue: 100,
    step: 2,
    defaultValue: [6, 64],
  },
};

describe('Controller constructor', () => {
  test('should store passed model and view', () => {
    const view = new View(testOptions.normal);
    const model = new Model(testOptions.normal);
    const controller = new Controller(model, view);

    expect(controller.view).toEqual(view);
    expect(controller.model).toEqual(model);
  });

  test('should call bindMovePin on the view', () => {
    const view = new View(testOptions.normal);
    const model = new Model(testOptions.normal);
    expect(view.bindMovePin).not.toHaveBeenCalled();

    new Controller(model, view);
    expect(view.bindMovePin).toHaveBeenCalled();
  });

  test('should call bindInputChange on the view', () => {
    const view = new View(testOptions.range);
    const model = new Model(testOptions.range);
    expect(view.bindInputChange).not.toHaveBeenCalled();

    new Controller(model, view);
    expect(view.bindInputChange).toHaveBeenCalled();
  });

  test('should bind _onValueChange handler to the model', () => {
    const view = new View(testOptions.normal);
    const model = new Model(testOptions.normal);
    expect(model._onValueChange).not.toBeInstanceOf(Function);

    new Controller(model, view);
    expect(model._onValueChange).toBeInstanceOf(Function);
  });
});
