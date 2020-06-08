import { ModelState } from '../interfaces';
import deleteUndef from '../utils/deleteUndef/deleteUndef';

export default class Model {
  userCallback: Function;
  _onStateChange: Function;
  _state: ModelState;

  constructor(modelState: ModelState) {
    this._state = modelState;
  }

  getState(): ModelState {
    return { ...this._state };
  }

  setState(modelState: ModelState): void {
    this._state = this.validateState(modelState);

    if (this._onStateChange) this._onStateChange(this._state.value);
    if (this.userCallback) this.userCallback(this._state.value);
  }

  bindSetState(handler?: Function): void {
    this._onStateChange = handler;
  }

  private validateValue(newValue: number | number[], state: ModelState): number | number[] {
    if (newValue === undefined) return this._state.value;
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

  private validateMinMaxValues(minValue: number, maxValue: number): { minValue: number; maxValue: number } {
    if (minValue === undefined || maxValue === undefined) {
      return {
        minValue: this._state.minValue,
        maxValue: this._state.maxValue,
      };
    }
    return minValue > maxValue
      ? {
          minValue: maxValue,
          maxValue: minValue,
        }
      : {
          minValue,
          maxValue,
        };
  }

  private validateStep(step: number): number {
    return Math.abs(step) || this._state.step;
  }

  private validateState(newState: ModelState): ModelState {
    const stateToValidate = { ...newState };
    const validatedStep = this.validateStep(stateToValidate.step);
    const validatedMinMaxValues = this.validateMinMaxValues(stateToValidate.minValue, stateToValidate.maxValue);
    const validatedValue = this.validateValue(stateToValidate.value, {
      ...this._state,
      step: validatedStep,
      ...validatedMinMaxValues,
    });

    const validatedState = {
      ...this._state,
      step: validatedStep,
      ...validatedMinMaxValues,
      value: validatedValue,
      range: Array.isArray(validatedValue),
    };

    deleteUndef(validatedState);

    return validatedState;
  }
}
