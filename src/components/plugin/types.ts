export interface Options {
  minValue: number;
  maxValue: number;
  step?: number;
  defaultValue?: number | number[];
  range?: boolean;
  scaleOptionsNum?: number;
  isTooltipDisabled?: boolean;
  isVertical?: boolean;
}

export interface ViewState {
  scaleOptionsNum: number;
  isTooltipDisabled: boolean;
  isVertical: boolean;
}

export interface ModelState {
  minValue: number;
  maxValue: number;
  step: number;
  defaultValue: number | number[];
  range?: boolean;
}

export interface PinData {
  pinNumber: number;
  isTooltipDisabled: boolean;
  isVertical: boolean;
  value: number;
}

export interface ScaleData {
  scaleOptionsNum: number;
  isVertical: boolean;
  minValue: number;
  maxValue: number;
}
