import { ModelState } from '../types';

export default class Model {
  _options: ModelState;
  _value: number | number[];
  _onValueChange: Function;
  _initialValue: number | number[];

  constructor(modelState: ModelState) {
    this._options = modelState;
    this._initialValue = this._options.defaultValue;
    this._value = Array.isArray(this._initialValue)
      ? [...(this._options.defaultValue as number[])]
      : this._options.defaultValue;
  }

  get value(): number | number[] {
    return this._value;
  }

  set value(newValue: number | number[]) {
    if (this._options.range) {
      (this._value as number[])[0] = Math.max(
        (newValue as number[])[0] <
          ((Math.ceil(this._options.minValue / this._options.step) * this._options.step - this._options.minValue) / 2 ||
            this._options.step / 2)
          ? Math.floor((newValue as number[])[0] / this._options.step) * this._options.step
          : Math.ceil((newValue as number[])[0] / this._options.step) * this._options.step,
        this._options.minValue,
      );
      (this._value as number[])[1] = Math.min(
        Math.ceil((newValue as number[])[1] / this._options.step) * this._options.step,
        this._options.maxValue,
      );
      if ((this._value as number[])[0] > (this._value as number[])[1]) {
        this._value = [
          Math.max((this._value as number[])[1], this._options.minValue),
          Math.min((this._value as number[])[0], this._options.maxValue),
        ];
      }
    } else {
      console.log(
        newValue as number,
        (Math.ceil(this._options.minValue / this._options.step) * this._options.step - this._options.minValue) / 2,
      );

      this._value =
        (newValue as number) <
        ((Math.ceil(this._options.minValue / this._options.step) * this._options.step - this._options.minValue) / 2 ||
          this._options.step / 2)
          ? Math.floor((newValue as number) / this._options.step) * this._options.step
          : Math.ceil((newValue as number) / this._options.step) * this._options.step;
      if (this._value > this._options.maxValue) this._value = this._options.maxValue;
      if (this._value < this._options.minValue) this._value = this._options.minValue;
    }
    if (this._onValueChange) this._onValueChange(this._value);
  }

  getPluginConfig(): ModelState {
    return { ...this._options };
  }

  bindSetValue(handler?: Function): void {
    this._onValueChange = handler;
  }
}
