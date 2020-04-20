import Model from '../Models/Model';
import View from '../Views/View';

export default class Controller {
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.view.render(this.model.value);

    if (this.model.getPluginConfig().range) {
      const firstPinHandler = (percentage: number): void => {
        // (<number[]>this.model.value)[0] = this.model.getPluginConfig().maxValue * percentage
        this.model.value = [this.model.getPluginConfig().maxValue * percentage, (this.model.value as number[])[1]];
        // console.log(this.model.value);
      };
      const secondPinHandler = (percentage: number): void => {
        this.model.value = [(this.model.value as number[])[0], this.model.getPluginConfig().maxValue * percentage];
        // console.log(this.model.value);
      };
      this.view.bindMovePin([firstPinHandler, secondPinHandler]);
    } else {
      this.view.bindMovePin((percentage: number): void => {
        model.value =
          this.model.getPluginConfig().minValue +
          percentage * Math.abs(this.model.getPluginConfig().maxValue - this.model.getPluginConfig().minValue);
      });
    }

    this.view.bindInputChange((e: Event) => {
      if (this.model.getPluginConfig().range) {
        const newVal = (e.target as HTMLInputElement).value.split(' ').map(e => +e.trim());
        model.value = newVal;
      } else {
        model.value = +(e.target as HTMLInputElement).value;
      }
    });

    this.model.bindSetValue((value: number | number[]) => {
      this.view.updateValue(value);
    });
  }
}
