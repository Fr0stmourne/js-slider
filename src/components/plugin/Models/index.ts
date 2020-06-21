import calculateSteps from './utils/calculateSteps';
import Observer from '../Observer';
import { DEFAULT_MODEL_STATE } from '../defaults';
import { ModelState, EventTypes } from 'types';

class Model extends Observer {
  private state: ModelState;

  constructor(modelState?: ModelState) {
    super();
    this.state = { ...DEFAULT_MODEL_STATE, ...modelState };

    const { minValue, maxValue, step } = this.getState();
    this.state.steps = calculateSteps({ minValue, maxValue, step });
  }

  getState(): ModelState {
    const { state } = this;
    return { ...state };
  }

  setState(modelState: Partial<ModelState>): void {
    this.state = this.validateState(modelState);
    const { minValue, maxValue, step } = this.getState();
    this.state.steps = calculateSteps({ minValue, maxValue, step });
    this.emit(EventTypes.StateChanged, { value: this.getState().value });
  }

  private findClosestStep(value: number): number {
    return this.state.steps.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a));
  }

  private validateValue(state: ModelState, newValue?: number[]): number[] {
    if (newValue === undefined) return this.state.value;
    let validatedValue: number[];

    const { value: prevValue } = state;
    const firstValue = this.findClosestStep(newValue[0]);
    let secondValue: number;
    if (newValue.length === 2) {
      secondValue = this.findClosestStep(newValue[1] || prevValue[1]);
    } else {
      secondValue = state.maxValue;
    }
    validatedValue = [firstValue, secondValue];
    const calculateValidatedValue = (): number[] => {
      const {
        state: { steps },
      } = this;
      if (newValue[0] === newValue[1]) return [steps[steps.indexOf(newValue[1]) - 1], newValue[1]];
      return prevValue[0] !== newValue[0]
        ? [steps[steps.indexOf(secondValue) - 1], secondValue]
        : [firstValue, steps[steps.indexOf(firstValue) + 1]];
    };

    if (state.range) {
      if (firstValue >= secondValue) {
        validatedValue = calculateValidatedValue();
      }
    } else {
      if (firstValue > secondValue) {
        validatedValue = calculateValidatedValue();
      }
    }

    return validatedValue;
  }

  private validateMinMaxValues(minValue?: number, maxValue?: number): { minValue: number; maxValue: number } {
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

  private validateStep(step?: number): number {
    if (step === undefined) return this.state.step;
    return Math.abs(step);
  }

  private validateState(newState: Partial<ModelState>): ModelState {
    const stateToValidate = { ...newState };

    const validatedStep = this.validateStep(stateToValidate.step);
    const validatedMinMaxValues = this.validateMinMaxValues(stateToValidate.minValue, stateToValidate.maxValue);
    this.state.steps = calculateSteps({
      minValue: validatedMinMaxValues.minValue,
      maxValue: validatedMinMaxValues.maxValue,
      step: validatedStep,
    });
    const validatedValue = this.validateValue(
      {
        ...this.state,
        step: validatedStep,
        ...validatedMinMaxValues,
        range: stateToValidate.range || false,
      },
      stateToValidate.value,
    );

    const validatedState = {
      ...this.state,
      step: validatedStep,
      ...validatedMinMaxValues,
      value: validatedValue,
      range: stateToValidate.range || false,
    };

    return validatedState;
  }
}

export default Model;
