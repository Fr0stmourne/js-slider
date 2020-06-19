import BarView from './View/components/BarView';
import PinView from './View/components/PinView';
import InputView from './View/components/InputView';
import ScaleView from './View/components/ScaleView';

export type Options = ViewState & ModelState;

export type ViewState = {
  scaleOptionsNum?: number;
  isTooltipDisabled?: boolean;
  isVertical?: boolean;
  sliderSize?: DOMRect;
};

export type EventCallback = (data: any) => void;

export type Events = {
  [key in EventTypes]?: EventCallback[];
};

export type ModelState = {
  minValue?: number;
  maxValue?: number;
  step?: number;
  value?: number | number[];
  range?: boolean;
};

export type PinData = {
  pinNumber: number;
  isTooltipDisabled: boolean;
  isVertical: boolean;
  value: number;
};

export type ScaleData = {
  scaleOptionsNum: number;
  step: number;
  isVertical: boolean;
  minValue: number;
  maxValue: number;
  sliderSize?: number;
};

export type BarData = {
  minValue: number;
  maxValue: number;
  isVertical: boolean;
};

export type Objects = {
  bar: BarView;
  firstPin: PinView;
  secondPin?: PinView;
  input: InputView;
  scale?: ScaleView;
};

export type MouseMoveData = {
  pin: PinView;
  shift: number;
};

export enum EventTypes {
  ValueChanged = 'ValueChanged',
  StateChanged = 'StateChanged',
  NewScaleValue = 'NewScaleValue',
  NewBarValue = 'NewBarValue',
}
