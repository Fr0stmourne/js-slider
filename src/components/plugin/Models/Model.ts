import { ModelState } from '../types';

export default class Model {
  _onStateChange: Function;
  state: ModelState;

  constructor(modelState: ModelState) {
    this.state = modelState;
  }

  validateValue(newValue: number | number[], state: ModelState): number | number[] {
    const { minValue, step, maxValue, value } = state;
    let validatedValue;
    if (Array.isArray(newValue)) {
      const firstValue = Math.max(
        (newValue as number[])[0] < ((Math.ceil(minValue / step) * step - minValue) / 2 || step / 2)
          ? Math.floor((newValue as number[])[0] / step) * step
          : Math.ceil((newValue as number[])[0] / step) * step,
        minValue,
      );

      const secondValue = Math.min(Math.ceil((newValue as number[])[1] / step) * step, maxValue);
      validatedValue = [firstValue, secondValue];

      if (firstValue >= secondValue) {
        validatedValue = value;
      }
    } else {
      validatedValue =
        (newValue as number) < ((Math.ceil(minValue / step) * step - minValue) / 2 || step / 2)
          ? Math.floor((newValue as number) / step) * step
          : Math.ceil((newValue as number) / step) * step;
      if (validatedValue > maxValue) validatedValue = maxValue;
      if (validatedValue < minValue) validatedValue = minValue;
    }

    return validatedValue;
  }

  getState(): ModelState {
    return { ...this.state };
  }

  setState(modelState: ModelState): void {
    const newState = {
      ...this.state,
      ...modelState,
    };

    newState.value = this.validateValue(newState.value, newState);
    console.log(newState);

    this.state = {
      ...this.state,
      ...newState,
    };

    if (this._onStateChange) this._onStateChange(this.state.value);
  }

  bindSetState(handler?: Function): void {
    this._onStateChange = handler;
  }
}
