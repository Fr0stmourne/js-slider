import { boundMethod } from 'autobind-decorator';

import Model from '../Models/Model';
import View from '../Views/View/View';
import { EventTypes, ModelState, Options } from '../interfaces';

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

    this.model.on(EventTypes.stateChanged, callUserCallback);
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

  // setOptions(options: Options) {
  //   const { view, model } = this;
  //       const newOptions = { ...options, sliderSize: (el.firstChild as HTMLElement).getBoundingClientRect() };
  //       const updatedViewState = getViewState({
  //         ...newOptions,
  //       });
  //       const updatedModelState = getModelState({ ...newOptions });

  //       model.state = updatedModelState;
  //       view.setState(updatedViewState, model.state);
  //       view.render();

  //       $(el)
  //         .data()
  //         .slider.connect();

  //       $(el)
  //         .children()
  //         .first()
  //         .replaceWith(view.element);

  //       view.updateValue(model.state.value);
  // }

  connect(): void {
    const { _setModelValue, _updateView, view, model } = this;

    view.on(EventTypes.valueChanged, _setModelValue);
    model.on(EventTypes.stateChanged, _updateView);
  }

  @boundMethod
  private _setModelValue(data: ModelState): void {
    const { model } = this;
    model.state = { ...model.state, ...data };
  }

  @boundMethod
  private _updateView({ value }: { value: number | number[] }): void {
    this.view.updateValue(Array.isArray(value) ? [...value] : value);
  }
}
