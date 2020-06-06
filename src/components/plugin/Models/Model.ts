import { ModelState } from '../types';

export default class Model {
  _onStateChange: Function;
  state: ModelState;

  constructor(modelState: ModelState) {
    this.state = modelState;
  }

  validateValue(newValue: number | number[]): number | number[] {
    const { minValue, step, maxValue, value } = this.state;
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
    const validatedState = {
      ...this.state,
      ...modelState,
      value: this.validateValue(modelState.value),
    };
    this.state = {
      ...this.state,
      ...validatedState,
    };

    if (this._onStateChange) this._onStateChange(this.state.value);
  }

  bindSetState(handler?: Function): void {
    this._onStateChange = handler;
  }
}
