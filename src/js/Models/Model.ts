export default class Model {
  _options: any;
  // defaultValue: number;
  // minmaxValues: Array<number>;
  // isTooltipEnabled: boolean;
  // isRanged: boolean;
  // step: number;
  _value: number | number[];
  onValueChange: Function;

  constructor(options: {
    // defaultValue?: number,
    // minmaxValues: Array<number>,
    // isTooltipEnabled?: boolean,
    // range?: boolean,
    // step?: number
  }) {
    // this.defaultValue = options.defaultValue;
    // this.minmaxValues = options.minmaxValues;
    // this.isTooltipEnabled = options.isTooltipEnabled;
    // this.range = options.range;
    // this.step = options.step;
    this._options = options;
    this._value = this._options.defaultValue;
  }

  get value(): number | number[] {
    return this._value;
  }

  set value(newValue: number | number[]) {
    if (this._options.range) {
      (this._value as number[])[0] = Math.max(
        Math.ceil((newValue as number[])[0] / this._options.step) * this._options.step,
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

      this.onValueChange(this._value);
    } else {
      this._value = Math.ceil((newValue as number) / this._options.step) * this._options.step;
      if (this._value > this._options.maxValue) this._value = this._options.maxValue;
      if (this._value < this._options.minValue) this._value = this._options.minValue;

      this.onValueChange(this._value);
    }
  }

  getPluginConfig(): any {
    return this._options;
  }

  bindSetValue(handler?: Function): void {
    this.onValueChange = handler;
  }
}
