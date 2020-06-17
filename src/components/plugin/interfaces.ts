import BarView from './Views/subviews/BarView/BarView';
import PinView from './Views/subviews/PinView/PinView';
import InputView from './Views/subviews/InputView/InputView';
import ScaleView from './Views/subviews/ScaleView/ScaleView';

export type Options = ViewState & ModelState;

export interface ViewState {
  scaleOptionsNum?: number;
  isTooltipDisabled?: boolean;
  isVertical?: boolean;
  sliderSize?: DOMRect;
}

export type EventCallback = (data: any) => void;

export type Events = {
  [key in EventTypes]?: EventCallback[];
};

export interface ModelState {
  minValue?: number;
  maxValue?: number;
  step?: number;
  value?: number | number[];
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
  step: number;
  isVertical: boolean;
  minValue: number;
  maxValue: number;
  sliderSize?: number;
}

export interface BarData {
  minValue: number;
  maxValue: number;
  isVertical: boolean;
}

export interface Objects {
  bar: BarView;
  firstPin: PinView;
  secondPin?: PinView;
  input: InputView;
  scale?: ScaleView;
}

export interface MouseMoveData {
  pin: PinView;
  shift: number;
}

export enum EventTypes {
  valueChanged = 'valueChanged',
  stateChanged = 'stateChanged',
  newScaleValue = 'newScaleValue',
  newBarValue = 'newBarValue',
}
