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
    const { _setModelValue, view, model } = this;

    // view.bindMovePin(_setModelValue);

    // view.bindInputChange(_setModelValue);

    // view.bindScaleClick(_setModelValue);

    // view.bindBarClick(_setModelValue);

    view.on('valueChanged', _setModelValue);

    if (this.model.userCallback) {
      model.on('stateChanged', this.model.userCallback);
    }
    model.on('stateChanged', this._updateView);
  }

  /* istanbul ignore next */
  @boundMethod
  private _setModelValue(data: object): void {
    const { model } = this;
    model.state = { ...model.state, ...data };
  }

  /* istanbul ignore next */
  @boundMethod
  private _updateView({ value }: { value: number | number[] }): void {
    this.view.updateValue(Array.isArray(value) ? [...value] : value);
  }
}
