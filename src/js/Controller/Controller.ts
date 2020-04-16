interface Options {
  minmaxValues: Array<number>;
  step?: number;
  type?: string;
  isValueEnabled?: boolean;
  isRanged?: boolean;
  defaultValue?: number;
}

class Controller {
  options: Options;
  
  constructor(options: Options) {
    this.options = options;

  }


}