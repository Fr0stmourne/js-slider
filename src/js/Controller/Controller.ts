import Model from '../Models/Model';
import View from '../Views/View';
import calculateValue from '../utils/calculateValue/calculateValue';

export default class Controller {
  model: Model;
  view: View;
  config: {
    minValue: number;
    maxValue: number;
  };

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.view.render(this.model.value);

    this.config = this.model.getPluginConfig();

    if (this.model.getPluginConfig().range) {
      const firstPinHandler = (percentage: number): void => {
        this.model.value = [
          calculateValue(percentage, this.config.minValue, this.config.maxValue),
          (this.model.value as number[])[1],
        ];
      };
      const secondPinHandler = (percentage: number): void => {
        this.model.value = [
          (this.model.value as number[])[0],
          calculateValue(percentage, this.config.minValue, this.config.maxValue),
        ];
      };

      this.view.bindMovePin([firstPinHandler, secondPinHandler]);
    } else {
      this.view.bindMovePin((percentage: number): void => {
        model.value = calculateValue(percentage, this.config.minValue, this.config.maxValue);
      });
    }

    this.view.bindInputChange((newValue: number | number[]) => {
      // if (this.model.getPluginConfig().range) {
      //   const newVal = (e.target as HTMLInputElement).value.split(' ').map(e => +e.trim());
      //   model.value = newVal;
      // } else {
      //   model.value = +(e.target as HTMLInputElement).value;
      // }
      model.value = newValue;
    });

    this.model.bindSetValue((value: number | number[]) => {
      this.view.updateValue(value);
    });
  }
}
