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

  get value() : number | number[]{
    return this._value;
  }

  set value(newValue: number | number[]) {
    // console.log('set value');
    // console.log('cond', this._options.range);
    
    if (this._options.range) {
      this._value = [Math.ceil((<number[]>newValue)[0] / this._options.step) * this._options.step,
      Math.ceil((<number[]>newValue)[1] / this._options.step) * this._options.step];
      this._value[0] = Math.max(Math.ceil((<number[]>newValue)[0] / this._options.step) * this._options.step, this._options.minValue);
      this._value[1] = Math.min(Math.ceil((<number[]>newValue)[1] / this._options.step) * this._options.step, this._options.maxValue);
      console.log('model value', this._value);
      
      this.onValueChange(this._value)
    } else {
      this._value = Math.ceil(<number>newValue / this._options.step) * this._options.step;
      if (this._value > this._options.maxValue) this._value = this._options.maxValue;
      if (this._value < this._options.minValue) this._value = this._options.minValue;
      this.onValueChange(this._value)
    }
  }

  getPluginConfig() {
    return this._options;
  }

  bindSetValue(handler?: Function) {
    // console.log('assign func');
    
    this.onValueChange = handler;
  }

}