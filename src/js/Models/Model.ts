export default class Model {
  _options: {
    defaultValue: number | number[];
    step: number;
    range: boolean;
    minValue: number;
    maxValue: number;
    isTooltipDisabled?: boolean;
    scaleOptionsNum: number;
  };
  _value: number | number[];
  onValueChange: Function;
  _initialValue: number | number[];

  constructor(options: any) {
    this._options = options;
    this._initialValue = this._options.defaultValue;
    this._value = Array.isArray(this._initialValue)
      ? [...(this._options.defaultValue as number[])]
      : this._options.defaultValue;
    this._options.range = Array.isArray(this._options.defaultValue);
  }

  get value(): number | number[] {
    return this._value;
  }

  set value(newValue: number | number[]) {
    if (this._options.range) {
      (this._value as number[])[0] = Math.max(
        (newValue as number[])[0] === this._options.minValue
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
      this._value =
        (newValue as number) === this._options.minValue
          ? Math.floor((newValue as number) / this._options.step) * this._options.step
          : Math.ceil((newValue as number) / this._options.step) * this._options.step;
      if (this._value > this._options.maxValue) this._value = this._options.maxValue;
      if (this._value < this._options.minValue) this._value = this._options.minValue;
    }
    if (this.onValueChange) this.onValueChange(this._value);
  }

  getPluginConfig(): any {
    return { ...this._options };
  }

  bindSetValue(handler?: Function): void {
    this.onValueChange = handler;
  }
}
