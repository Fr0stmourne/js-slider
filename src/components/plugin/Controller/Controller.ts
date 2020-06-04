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
    if (this.model.getPluginConfig().range) {
      const firstPinHandler = (newValue: number): void => {
        this.model.value = [newValue, (this.model.value as number[])[1]];
      };
      const secondPinHandler = (newValue: number): void => {
        this.model.value = [(this.model.value as number[])[0], newValue];
      };

      this.view.bindMovePin([firstPinHandler, secondPinHandler]);
    } else {
      this.view.bindMovePin((newValue: number): void => {
        this.model.value = newValue;
      });
    }

    this.view.bindInputChange((newValue: number | number[]) => {
      this.model.value = newValue;
    });

    this.model.bindSetValue((value: number | number[]) => {
      this.view.updateValue(value);
    });

    this.view.bindScaleClick((value: number | number[]) => {
      this.model.value = value;
    });

    this.view.bindBarClick((value: number | number[]) => {
      this.model.value = value;
    });
  }
}
