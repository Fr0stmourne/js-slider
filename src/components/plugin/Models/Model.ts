import { ModelState } from '../interfaces';
import deleteUndef from '../utils/deleteUndef/deleteUndef';

export default class Model {
  userCallback: Function;
  onStateChange: Function;
  private _state: ModelState;

  constructor(modelState: ModelState) {
    this._state = modelState;
  }

  get state(): ModelState {
    return { ...this._state };
  }

  set state(modelState: ModelState) {
    this._state = this._validateState(modelState);

    if (this.onStateChange) this.onStateChange(this._state.value);
    if (this.userCallback) this.userCallback(this._state.value);
  }

  private _validateValue(newValue: number | number[], state: ModelState): number | number[] {
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

  private _validateMinMaxValues(minValue: number, maxValue: number): { minValue: number; maxValue: number } {
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

  private _validateStep(step: number): number {
    return Math.abs(step) || this._state.step;
  }

  private _validateState(newState: ModelState): ModelState {
    const stateToValidate = { ...newState };
    const validatedStep = this._validateStep(stateToValidate.step);
    const validatedMinMaxValues = this._validateMinMaxValues(stateToValidate.minValue, stateToValidate.maxValue);
    const validatedValue = this._validateValue(stateToValidate.value, {
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
