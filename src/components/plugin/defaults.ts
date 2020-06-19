import { ModelState, ViewState, Options } from './types';

const DEFAULT_MODEL_STATE: ModelState = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  value: 50,
  range: false,
};

const DEFAULT_VIEW_STATE: ViewState = {
  scaleOptionsNum: 5,
  isTooltipDisabled: false,
  isVertical: false,
  sliderSize: new DOMRect(),
};

const DEFAULT_CONFIG: Options = { ...DEFAULT_MODEL_STATE, ...DEFAULT_VIEW_STATE };

export { DEFAULT_MODEL_STATE, DEFAULT_VIEW_STATE, DEFAULT_CONFIG };
