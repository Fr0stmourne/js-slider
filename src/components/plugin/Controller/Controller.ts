import { boundMethod } from 'autobind-decorator';

import Model from '../Models/Model';
import View from '../Views/View/View';

export default class Controller {
  private _userCallback: Function;

  constructor(public model: Model, public view: View) {
    this.model = model;
    this.view = view;
    this.view.render();
    this.connect();
  }

  set userCallback(callback: Function) {
    this._userCallback = callback;

    const callUserCallback = ({ value }: { value: number | number[] }): void => {
      this._userCallback(value);
    };

    this.model.on('stateChanged', callUserCallback);
  }

  get userCallback(): Function {
    return this._userCallback;
  }

  connect(): void {
    const { _setModelValue, _updateView, view, model } = this;

    view.on('valueChanged', _setModelValue);
    model.on('stateChanged', _updateView);
  }

  @boundMethod
  private _setModelValue(data: object): void {
    const { model } = this;
    model.state = { ...model.state, ...data };
  }

  @boundMethod
  private _updateView({ value }: { value: number | number[] }): void {
    this.view.updateValue(Array.isArray(value) ? [...value] : value);
  }
}
