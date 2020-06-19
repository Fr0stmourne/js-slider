import deleteUndef from '../utils/deleteUndef';
import calculateSteps from '../utils/calculateSteps';
import Observer from '../Observer';
import { ModelState, EventTypes } from '../types';

export default class Model extends Observer {
  private _state: ModelState;
  private steps: number[];

  constructor(modelState: ModelState) {
    super();
    this._state = modelState;

    const { minValue, maxValue, step } = this.state;
    this.steps = calculateSteps({ minValue, maxValue, step });
  }

  get state(): ModelState {
    return { ...this._state };
  }

  set state(modelState: ModelState) {
    this._state = this.validateState(modelState);

    const { minValue, maxValue, step } = this.state;
    this.steps = calculateSteps({ minValue, maxValue, step });

    this.emit(EventTypes.StateChanged, { value: this.state.value });
  }

  private findClosestStep(value: number): number {
    return this.steps.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a));
  }

  private validateValue(newValue: number | number[], state: ModelState): number | number[] {
    if (newValue === undefined) return this._state.value;
    let validatedValue;

    if (Array.isArray(newValue)) {
      const { value: prevValue } = state;
      const firstValue = this.findClosestStep(newValue[0]);
      const secondValue = this.findClosestStep(newValue[1]);
      validatedValue = [firstValue, secondValue];

      // TODO
      if (firstValue >= secondValue) {
        validatedValue =
          (prevValue as number[])[0] !== newValue[0]
            ? [this.steps[this.steps.indexOf(secondValue) - 1], secondValue]
            : [firstValue, this.steps[this.steps.indexOf(firstValue) + 1]];
      }
    } else {
      validatedValue = this.findClosestStep(newValue);
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
    this.steps = calculateSteps({
      minValue: validatedMinMaxValues.minValue,
      maxValue: validatedMinMaxValues.maxValue,
      step: validatedStep,
    });
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
