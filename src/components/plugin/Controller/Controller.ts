import Model from '../Models/Model';
import View from '../Views/View/View';

export default class Controller {
  constructor(public model: Model, public view: View) {
    this.model = model;
    this.view = view;
    this.view.render();
    this.connect();
  }

  connect(): void {
    const { model, view } = this;
    if (model.getPluginConfig().range) {
      const firstPinHandler = (newValue: number): void => {
        model.value = [newValue, (model.value as number[])[1]];
      };
      const secondPinHandler = (newValue: number): void => {
        model.value = [(model.value as number[])[0], newValue];
      };

      view.bindMovePin([firstPinHandler, secondPinHandler]);
    } else {
      view.bindMovePin((newValue: number): void => {
        model.value = newValue;
      });
    }

    view.bindInputChange((newValue: number | number[]) => {
      model.value = newValue;
    });

    model.bindSetValue((value: number | number[]) => {
      view.updateValue(value);
    });

    view.bindScaleClick((value: number | number[]) => {
      model.value = value;
    });

    view.bindBarClick((value: number | number[]) => {
      model.value = value;
    });
  }
}
