import { ModelState } from '../types';

export default class Model {
  _options: ModelState;
  _value: number | number[];
  _onValueChange: Function;
  _initialValue: number | number[];

  constructor(modelState: ModelState) {
    this._options = modelState;
    this._initialValue = this._options.value;
    this._value = Array.isArray(this._initialValue) ? [...(this._options.value as number[])] : this._options.value;
  }

  get value(): number | number[] {
    return this._value;
  }

  set value(newValue: number | number[]) {
    const { range, minValue, step, maxValue } = this._options;
    if (range) {
      (this._value as number[])[0] = Math.max(
        (newValue as number[])[0] < ((Math.ceil(minValue / step) * step - minValue) / 2 || step / 2)
          ? Math.floor((newValue as number[])[0] / step) * step
          : Math.ceil((newValue as number[])[0] / step) * step,
        minValue,
      );
      (this._value as number[])[1] = Math.min(Math.ceil((newValue as number[])[1] / step) * step, maxValue);
      if ((this._value as number[])[0] > (this._value as number[])[1]) {
        this._value = [
          Math.max((this._value as number[])[1], minValue),
          Math.min((this._value as number[])[0], maxValue),
        ];
      }
    } else {
      this._value =
        (newValue as number) < ((Math.ceil(minValue / step) * step - minValue) / 2 || step / 2)
          ? Math.floor((newValue as number) / step) * step
          : Math.ceil((newValue as number) / step) * step;
      if (this._value > maxValue) this._value = maxValue;
      if (this._value < minValue) this._value = minValue;
    }
    if (this._onValueChange) this._onValueChange(this._value);
  }

  getState(): ModelState {
    return { ...this._options };
  }

  setState(modelState: ModelState) {
    this._options = {
      ...this._options,
      ...modelState,
    };
  }

  bindSetValue(handler?: Function): void {
    this._onValueChange = handler;
  }
}
