import { ModelState, ViewState, Options } from './types';

export const DEFAULT_MODEL_STATE: ModelState = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  value: 50,
  range: false,
};

export const DEFAULT_VIEW_STATE: ViewState = {
  scaleOptionsNum: 5,
  isTooltipDisabled: false,
  isVertical: false,
};

export const DEFAULT_CONFIG: Options = { ...DEFAULT_MODEL_STATE, ...DEFAULT_VIEW_STATE };
