import { ViewState, ModelState, PinData, ScaleData, Objects, MouseMoveData } from '../../interfaces';
import calculatePxNum from '../../utils/calculatePxNum/calculatePxNum';
import calculateValue from '../../utils/calculateValue/calculateValue';
import render from '../../utils/render/render';
import PinView from '../subviews/PinView/PinView';
import BarView from '../subviews/BarView/BarView';
import InputView from '../subviews/InputView/InputView';
import ScaleView from '../subviews/ScaleView/ScaleView';
import { PIN_SIZE } from '../../defaults';

export default class View {
  private _sliderSize: number;
  private _element: HTMLElement;
  private _viewState: ViewState;
  private _modelState: ModelState;
  private _objects: Objects;

  constructor(viewState: ViewState, modelState: ModelState) {
    this._viewState = viewState;
    this._modelState = modelState;
    this.render();
  }

  get element(): HTMLElement {
    return this._element;
  }

  get objects(): Objects {
    return { ...this._objects };
  }

  get state(): { viewState: ViewState; modelState: ModelState } {
    return {
      viewState: { ...this._viewState },
      modelState: { ...this._modelState },
    };
  }
  setState(viewState: ViewState, modelState: ModelState): void {
    this._viewState = { ...this._viewState, ...viewState };
    this._modelState = { ...this._modelState, ...modelState };
  }

  bindInputChange(handler?: Function): void {
    const input: InputView = this._objects.input;
    input.element.onchange = (e): void => {
      const newValue: number | number[] = this._modelState.range
        ? (e.target as HTMLInputElement).value.split(',').map(el => +el.trim())
        : +(e.target as HTMLInputElement).value;
      handler(newValue);
    };
  }

  bindScaleClick(handler?: Function): void {
    let handleScaleClick;
    if (this._objects.scale) {
      const rangeCaseHandler = (value: number): number => this._applyToCorrectPin(value, handler);
      handleScaleClick = this._modelState.range ? rangeCaseHandler : handler;
      (this._objects.scale.onOptionClick as Function) = handleScaleClick;
    }
  }

  bindMovePin(handler?: Function): void {
    const { range } = this._modelState;

    this._bindListenersToPin(this._objects.firstPin, handler);
    if (range) this._bindListenersToPin(this._objects.secondPin, handler);
  }

  bindBarClick(handler?: Function): void {
    const { isVertical } = this._viewState;
    const { minValue, maxValue, range } = this._modelState;

    const handleBarClick = (e: MouseEvent): void => {
      if (handler) {
        const percentage = isVertical
          ? ((e.target as HTMLElement).getBoundingClientRect().height - (e as MouseEvent).offsetY) /
            (e.target as HTMLElement).getBoundingClientRect().height
          : (e as MouseEvent).offsetX / (e.target as HTMLElement).getBoundingClientRect().width;

        const newValue = calculateValue(percentage, minValue, maxValue);

        if (range) {
          const correctPinNumber = this._applyToCorrectPin(newValue, handler);
          const pin = this._objects[correctPinNumber ? 'secondPin' : 'firstPin'];
          this._handleMouseDown(e, pin, handler);
        } else {
          handler(newValue);
          this._handleMouseDown(e, this._objects.firstPin, handler);
        }
      }
    };

    (this._objects.bar.onBarClick as Function) = handleBarClick;
  }

  updateValue(value: number | number[]): void {
    const { isVertical } = this._viewState;
    const { minValue, maxValue, range } = this._modelState;
    const sliderSize = isVertical ? +this._objects.bar.element.clientHeight : +this._objects.bar.element.clientWidth;
    if (range) {
      const pins = [1, 2];
      const pxNums = pins.map((el, idx) => calculatePxNum((value as number[])[idx], minValue, maxValue, sliderSize));

      this._objects.firstPin.updateValue(pxNums[0], (value as number[])[0]);
      this._objects.secondPin.updateValue(pxNums[1], (value as number[])[1]);
    } else {
      const pxNum = calculatePxNum(value as number, minValue, maxValue, sliderSize);
      this._objects.firstPin.updateValue(pxNum, value as number);
    }

    this._objects.input.value = value;
    this._modelState.value = value;
  }

  render(): void {
    const VERTICAL_MODIFIER = 'slider-plugin--vertical';
    const { isVertical, scaleOptionsNum, isTooltipDisabled, sliderSize } = this._viewState;
    const { value, minValue, maxValue, range, step } = this._modelState;
    this._element = render(
      `
    <div class="slider-plugin js-slider ${isVertical ? VERTICAL_MODIFIER : ''}">
    </div>
    `,
    );

    this._sliderSize = sliderSize && Math.max(+sliderSize.height, +sliderSize.width);

    const firstPinData: PinData = {
      pinNumber: 1,
      isTooltipDisabled,
      isVertical,
      value: (range ? (value as number[])[0] : value) as number,
    };

    this._objects = {
      bar: new BarView(),
      firstPin: new PinView(firstPinData),
      input: new InputView(value),
    };

    if (scaleOptionsNum && this._sliderSize) {
      const scaleData: ScaleData = {
        scaleOptionsNum: scaleOptionsNum,
        step,
        isVertical,
        minValue,
        maxValue,
        sliderSize: this._sliderSize,
      };
      this._objects.scale = new ScaleView(scaleData);
    }

    if (range) {
      const secondPinData: PinData = {
        pinNumber: 2,
        isTooltipDisabled,
        isVertical,
        value: (value as number[])[1],
      };
      this._objects.secondPin = new PinView(secondPinData);
    }

    const { firstPin, secondPin, scale, bar } = this._objects;
    this._objects.bar.element.append(firstPin.element);
    if (range) {
      this._objects.bar.element.append(secondPin.element);
    }
    this._element.append(bar.element);

    if (scale) this._element.append(scale.element);
  }

  /* istanbul ignore next */
  private _applyToCorrectPin(value: number, handler?: Function): number {
    const pinValues = [this._objects.firstPin.value, this._objects.secondPin.value];
    const FIRST_PIN = 0;
    const SECOND_PIN = 1;
    const chosenPin =
      Math.abs(value - this._objects.firstPin.value) < Math.abs(value - this._objects.secondPin.value)
        ? FIRST_PIN
        : SECOND_PIN;
    pinValues[chosenPin] = value;
    handler(pinValues);
    return chosenPin;
  }

  /* istanbul ignore next */
  private _bindListenersToPin(pin: PinView, handler?: Function): void {
    const handleMouseDown = (event: MouseEvent): void => this._handleMouseDown(event, pin, handler);
    pin.element.addEventListener('mousedown', handleMouseDown);
  }

  /* istanbul ignore next */
  private _handleMouseDown(event: MouseEvent, pin: PinView, handler?: Function): void {
    const { isVertical } = this._viewState;

    event.preventDefault();
    const shift = isVertical ? event.offsetX : (event.target as HTMLElement).offsetHeight - event.offsetY;

    const mouseMoveData: MouseMoveData = {
      pin,
      shift,
      handler,
    };

    const handleMouseMove = (e: MouseEvent): void => this._handleMouseMove(e, mouseMoveData);

    const handleMouseUp = (): void => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  private _handleMouseMove(e: MouseEvent, data: MouseMoveData): void {
    const { isVertical } = this._viewState;
    const { minValue, maxValue, range, value } = this._modelState;
    const { pin, shift, handler } = data;
    const slider = this._objects.bar.element;

    let newValue = isVertical
      ? -(e.clientY - shift - slider.getBoundingClientRect().bottom) - PIN_SIZE / 2
      : e.clientX - shift - slider.getBoundingClientRect().left + PIN_SIZE / 2;

    const sliderSize = isVertical ? slider.offsetHeight : slider.offsetWidth;
    if (newValue < 0) newValue = 0;
    const rightEdge = sliderSize;
    if (newValue > rightEdge) newValue = rightEdge;

    const percentage = newValue / sliderSize;

    const calculatedValue = calculateValue(+percentage, minValue, maxValue);
    let resultValue = value;
    if (range) {
      (resultValue as number[])[pin.pinNumber - 1] = calculatedValue;
    } else {
      resultValue = calculatedValue;
    }

    if (handler) handler(resultValue);
  }
}
