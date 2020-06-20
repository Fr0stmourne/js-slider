import { boundMethod } from 'autobind-decorator';

import Model from '../Models';
import View from '../View';
import { EventTypes, ModelState, ViewState } from '../types';

class Controller {
  private userCallback!: Function;

  constructor(private model: Model, private view: View) {
    this.view.render();
    this.connect();
  }

  setUserCallback(callback: Function): void {
    this.userCallback = callback;

    const callUserCallback = ({ value }: { value: number | number[] }): void => {
      this.userCallback(value);
    };

    this.model.on(EventTypes.StateChanged, callUserCallback);
  }

  getUserCallback(): Function {
    return this.userCallback;
  }

  get value(): number[] {
    return this.model.getState().value;
  }

  set value(value: number[]) {
    this.model.setState({
      ...this.model.getState(),
      value,
    });
  }

  getViewState(): ViewState {
    return { ...this.view.state.viewState };
  }

  setViewState(viewState: Partial<ViewState>, modelState: ModelState): void {
    this.view.setState(viewState, modelState);
  }

  getModelState(): ModelState {
    return { ...this.model.getState() };
  }

  setModelState(state: Partial<ModelState>): void {
    this.model.setState(state);
  }

  get element(): HTMLElement {
    return this.view.getElement();
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
    model.setState({ ...model.getState(), ...data });
  }

  @boundMethod
  private updateView({ value }: { value: number[] }): void {
    this.view.updateValue([...value]);
  }
}

export default Controller;
