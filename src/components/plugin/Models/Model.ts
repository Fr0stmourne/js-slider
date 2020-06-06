import { ModelState } from '../interfaces';
import deleteUndef from '../utils/deleteUndef/deleteUndef';

export default class Model {
  _onStateChange: Function;
  state: ModelState;

  constructor(modelState: ModelState) {
    this.state = modelState;
  }

  validateValue(newValue: number | number[], state: ModelState): number | number[] {
    if (newValue === undefined) return this.state.value;
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

  validateMinMaxValues(minValue: number, maxValue: number): { minValue: number; maxValue: number } {
    if (minValue === undefined || maxValue === undefined) {
      return {
        minValue: this.state.minValue,
        maxValue: this.state.maxValue,
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

  validateStep(step: number): number {
    return Math.abs(step) || this.state.step;
  }

  validateState(newState: ModelState): ModelState {
    const stateToValidate = { ...newState };
    const validatedStep = this.validateStep(stateToValidate.step);
    const validatedMinMaxValues = this.validateMinMaxValues(stateToValidate.minValue, stateToValidate.maxValue);
    const validatedValue = this.validateValue(stateToValidate.value, {
      ...this.state,
      step: validatedStep,
      ...validatedMinMaxValues,
    });

    const validatedState = {
      ...this.state,
      step: validatedStep,
      ...validatedMinMaxValues,
      value: validatedValue,
      range: Array.isArray(validatedValue),
    };

    deleteUndef(validatedState);

    return validatedState;
  }

  getState(): ModelState {
    return { ...this.state };
  }

  setState(modelState: ModelState): void {
    this.state = this.validateState(modelState);

    if (this._onStateChange) this._onStateChange(this.state.value);
  }

  bindSetState(handler?: Function): void {
    this._onStateChange = handler;
  }
}
