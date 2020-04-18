export default class Model {
  _options: any;
  // defaultValue: number;
  // minmaxValues: Array<number>;
  // isTooltipEnabled: boolean;
  // isRanged: boolean;
  // step: number;
  _value: number;
  onValueChange: Function;

  constructor(options: {
    // defaultValue?: number,
    // minmaxValues: Array<number>,
    // isTooltipEnabled?: boolean,
    // isRanged?: boolean,
    // step?: number
  }) {
    // this.defaultValue = options.defaultValue;
    // this.minmaxValues = options.minmaxValues;
    // this.isTooltipEnabled = options.isTooltipEnabled;
    // this.isRanged = options.isRanged;
    // this.step = options.step;
    this._options = options;
    this._value = this._options.defaultValue;
    console.log(this._value,  this._options.defaultValue);
    
  }

  get value() : number {
    return this._value;
  }

  set value(newValue: number) {
    this._value = newValue;
    this.onValueChange(this._value)
  }

  getPluginConfig() {
    return this._options;
  }

  bindSetValue(handler?: Function) {
    this.onValueChange = handler;
  }

}