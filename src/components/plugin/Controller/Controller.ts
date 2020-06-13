import { boundMethod } from 'autobind-decorator';

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
    const { setModelValue, view, model } = this;

    view.bindMovePin(setModelValue);

    view.bindInputChange(setModelValue);

    view.bindScaleClick(setModelValue);

    view.bindBarClick(setModelValue);

    model.onStateChange = (value: number | number[]): void => {
      view.updateValue(value);
    };
  }

  /* istanbul ignore next */
  @boundMethod
  private setModelValue(value: number | number[]): void {
    const { model } = this;
    model.state = { ...model.state, value };
  }
}
