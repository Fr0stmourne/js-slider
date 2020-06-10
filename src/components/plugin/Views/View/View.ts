import { ViewState, ModelState, PinData, ScaleData } from '../../interfaces';
import calculatePxNum from '../../utils/calculatePxNum/calculatePxNum';
import calculateValue from '../../utils/calculateValue/calculateValue';
import render from '../../utils/render/render';
import PinView from '../subviews/PinView/PinView';
import BarView from '../subviews/BarView/BarView';
import InputView from '../subviews/InputView/InputView';
import ScaleView from '../subviews/ScaleView/ScaleView';
import { PIN_SIZE } from '../../defaults';

export default class View {
  _sliderSize: number;
  _element: HTMLElement;
  _viewOptions: ViewState;
  _modelOptions: ModelState;
  _elements: {
    bar: HTMLElement;
    firstPin: HTMLElement;
    secondPin?: HTMLElement;
    firstValue: HTMLElement;
    secondValue?: HTMLElement;
    input: HTMLInputElement;
  };
  _objects: { bar: BarView; firstPin: PinView; secondPin?: PinView; input: InputView; scale?: ScaleView };

  constructor(viewState: ViewState, modelState: ModelState) {
    this._viewOptions = viewState;
    this._modelOptions = modelState;
    this.render();
  }

  get element(): HTMLElement {
    return this._element;
  }

  setState(viewState: ViewState, modelState: ModelState): void {
    this._viewOptions = { ...this._viewOptions, ...viewState };
    if (modelState) this._modelOptions = { ...this._modelOptions, ...modelState };
  }

  bindInputChange(handler?: Function): void {
    const input: InputView = this._objects.input;
    input.element.onchange = (e): void => {
      const newValue: number | number[] = this._modelOptions.range
        ? (e.target as HTMLInputElement).value.split(',').map(el => +el.trim())
        : +(e.target as HTMLInputElement).value;
      handler(newValue);
    };
  }

  bindScaleClick(handler?: Function): void {
    let handleScaleClick;
    if (this._objects.scale) {
      handleScaleClick = this._modelOptions.range
        ? (value: number): number => this.applyToCorrectPin(value, handler)
        : handler;
      (this._objects.scale.onOptionClick as Function) = handleScaleClick;
    }
  }

  bindMovePin(valueHandler?: Function): void {
    const { range } = this._modelOptions;

    this.bindListenersToPin(this._objects.firstPin, valueHandler);
    if (range) this.bindListenersToPin(this._objects.secondPin, valueHandler);
  }

  bindBarClick(handler?: Function): void {
    const { isVertical } = this._viewOptions;
    const { minValue, maxValue, range } = this._modelOptions;

    const handleBarClick = (e: MouseEvent): void => {
      if (handler) {
        const percentage = isVertical
          ? ((e.target as HTMLElement).getBoundingClientRect().height - (e as MouseEvent).offsetY) /
            (e.target as HTMLElement).getBoundingClientRect().height
          : (e as MouseEvent).offsetX / (e.target as HTMLElement).getBoundingClientRect().width;

        const newValue = calculateValue(percentage, minValue, maxValue);

        if (range) {
          const correctPinNumber = this.applyToCorrectPin(newValue, handler);
          const pin = this._objects[correctPinNumber ? 'secondPin' : 'firstPin'];
          this.onMouseDown(e, pin, handler);
        } else {
          handler(newValue);
          this.onMouseDown(e, this._objects.firstPin, handler);
        }
      }
    };

    (this._objects.bar.onBarClick as Function) = handleBarClick;
  }

  updateValue(value: number | number[]): void {
    const { isVertical } = this._viewOptions;
    const { minValue, maxValue, range } = this._modelOptions;
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
  }

  render(): void {
    const VERTICAL_MODIFIER = 'slider-plugin--vertical';
    const { isVertical, scaleOptionsNum, isTooltipDisabled, sliderSize } = this._viewOptions;
    const { value, minValue, maxValue, range, step } = this._modelOptions;
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
  private applyToCorrectPin(value: number, handler?: Function): number {
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
  private bindListenersToPin(pin: PinView, handler?: Function): void {
    const onMouseDown = (event: MouseEvent): void => this.onMouseDown(event, pin, handler);
    pin.element.addEventListener('mousedown', onMouseDown);
  }

  /* istanbul ignore next */
  private onMouseDown(event: MouseEvent, pin: PinView, handler?: Function): void {
    const { isVertical } = this._viewOptions;
    const { minValue, maxValue, range, value } = this._modelOptions;
    const slider = this._objects.bar.element;
    event.preventDefault();
    const shift = isVertical
      ? event.clientY - pin.element.getBoundingClientRect().bottom
      : event.clientX - pin.element.getBoundingClientRect().left;

    const onMouseMove = (e: MouseEvent): void => {
      let newValue = isVertical
        ? -(e.clientY - shift - slider.getBoundingClientRect().bottom) + PIN_SIZE / 2
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
    };

    const onMouseUp = (): void => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
