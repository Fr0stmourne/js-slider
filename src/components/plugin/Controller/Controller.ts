import { boundMethod } from 'autobind-decorator';

import Model from '../Models/Model';
import View from '../Views/View/View';

export default class Controller {
  userCallback: Function;

  constructor(public model: Model, public view: View) {
    this.model = model;
    this.view = view;
    this.view.render();
    this.connect();
  }

  setUserCallback(callback: Function): void {
    this.userCallback = callback;

    const callUserCallback = ({ value }: { value: number | number[] }): void => {
      this.userCallback(value);
    };

    this.model.on('stateChanged', callUserCallback);
  }

  connect(): void {
    const { _setModelValue, view, model } = this;

    view.on('valueChanged', _setModelValue);
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
