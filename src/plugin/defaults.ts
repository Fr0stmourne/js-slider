import { ModelState, ViewState, Options } from 'types';

import calculateSteps from './Model/utils/calculateSteps';

const DEFAULT_MODEL_STATE: ModelState = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  value: [50, 100],
  steps: calculateSteps({ minValue: 50, maxValue: 100, step: 1 }),
  range: false,
};

const DEFAULT_VIEW_STATE: ViewState = {
  milestonesNumber: 5,
  isTooltipDisabled: false,
  isVertical: false,
  showProgress: true,
  container: document.createElement('div'),
};

const DEFAULT_CONFIG: Options = { ...DEFAULT_MODEL_STATE, ...DEFAULT_VIEW_STATE };

export { DEFAULT_MODEL_STATE, DEFAULT_VIEW_STATE, DEFAULT_CONFIG };
