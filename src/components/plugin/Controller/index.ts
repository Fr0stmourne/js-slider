import { boundMethod } from 'autobind-decorator';

import Model from '../Models';
import View from '../View';
import { EventTypes, ModelState, ViewState } from '../types';

export default class Controller {
  private _userCallback!: Function;

  constructor(public model: Model, public view: View) {
    this.view.render();
    this.connect();
  }

  set userCallback(callback: Function) {
    this._userCallback = callback;

    const callUserCallback = ({ value }: { value: number | number[] }): void => {
      this._userCallback(value);
    };

    this.model.on(EventTypes.StateChanged, callUserCallback);
  }

  get userCallback(): Function {
    return this._userCallback;
  }

  get value(): number | number[] {
    return this.model.state.value;
  }

  set value(value: number | number[]) {
    this.model.state = {
      ...this.model.state,
      value,
    };
  }

  get viewState(): ViewState {
    return { ...this.view.state.viewState };
  }

  setViewState(viewState: ViewState, modelState: ModelState): void {
    this.view.setState(viewState, modelState);
  }

  get modelState(): ModelState {
    return { ...this.model.state };
  }

  set modelState(state: ModelState) {
    this.model.state = state;
  }

  get element(): HTMLElement {
    return this.view.element;
  }

  render(): void {
    this.view.render();
  }

  connect(): void {
    const { setModelValue, updateView, view, model } = this;

    view.on(EventTypes.ValueChanged, setModelValue);
    model.on(EventTypes.StateChanged, updateView);
  }

  @boundMethod
  private setModelValue(data: ModelState): void {
    const { model } = this;
    model.state = { ...model.state, ...data };
  }

  @boundMethod
  private updateView({ value }: { value: number | number[] }): void {
    this.view.updateValue(Array.isArray(value) ? [...value] : value);
  }
}
