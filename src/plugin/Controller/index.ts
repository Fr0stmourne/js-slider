import { boundMethod } from 'autobind-decorator';

import { EventTypes, ModelState, ViewState } from 'types';

import Model from '../Model';
import View from '../View';

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

  setValue(value: number[]): void {
    this.model.setState({
      ...this.model.getState(),
      value,
    });
  }

  getViewState(): ViewState {
    return { ...this.view.getState().viewState };
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

  getElement(): HTMLElement {
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
    this.view.setState({}, this.model.getState());
    this.view.updateValue([...value]);
  }
}

export default Controller;
