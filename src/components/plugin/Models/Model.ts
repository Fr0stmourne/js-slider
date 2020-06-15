import { ModelState } from '../interfaces';
import deleteUndef from '../utils/deleteUndef/deleteUndef';
import calculateSteps from '../utils/calculateSteps/calculateSteps';
import Observer from '../Observer/Observer';

export default class Model extends Observer {
  userCallback: Function;
  onStateChange: Function;
  private _state: ModelState;
  private _steps: number[];

  constructor(modelState: ModelState) {
    super();
    this._state = modelState;

    const { minValue, maxValue, step } = this.state;
    this._steps = calculateSteps(minValue, maxValue, step);
  }

  get state(): ModelState {
    return { ...this._state };
  }

  set state(modelState: ModelState) {
    this._state = this._validateState(modelState);

    const { minValue, maxValue, step } = this.state;
    this._steps = calculateSteps(minValue, maxValue, step);

    if (this.onStateChange) this.onStateChange(this.state.value);
    if (this.userCallback) this.userCallback(this.state.value);
  }

  private _findClosestStep(value: number): number {
    return this._steps.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a));
  }

  private _validateValue(newValue: number | number[], state: ModelState): number | number[] {
    if (newValue === undefined) return this._state.value;
    const { value } = state;
    let validatedValue;

    if (Array.isArray(newValue)) {
      const firstValue = this._findClosestStep(newValue[0]);
      const secondValue = this._findClosestStep(newValue[1]);
      validatedValue = [firstValue, secondValue];

      const prevValue = [this._findClosestStep((value as number[])[0]), this._findClosestStep((value as number[])[1])];
      if (firstValue >= secondValue) {
        validatedValue = prevValue;
      }
    } else {
      validatedValue = this._findClosestStep(newValue);
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
