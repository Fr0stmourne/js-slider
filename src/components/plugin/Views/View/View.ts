import { ViewState, ModelState, PinData, ScaleData, Objects, MouseMoveData, EventTypes } from '../../interfaces';
import calculatePxNum from '../../utils/calculatePxNum/calculatePxNum';
import calculateValue from '../../utils/calculateValue/calculateValue';
import render from '../../utils/render/render';
import PinView from '../subviews/PinView/PinView';
import BarView from '../subviews/BarView/BarView';
import InputView from '../subviews/InputView/InputView';
import ScaleView from '../subviews/ScaleView/ScaleView';
import Observer from '../../Observer/Observer';
import camelToHyphen from '../../utils/camelToHyphen/camelToHyphen';

export default class View extends Observer {
  private _sliderSize: number;
  private _element: HTMLElement;
  private _viewState: ViewState;
  private _modelState: ModelState;
  private _objects: Objects;

  constructor(viewState: ViewState, modelState: ModelState) {
    super();
    this._viewState = viewState;
    this._modelState = modelState;
    this.render();
  }

  get element(): HTMLElement {
    return this._element;
  }

  get objects(): Objects {
    return this._objects;
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

  bindListeners(): void {
    this._bindBarClick();
    this._bindMovePin();
    this._bindScaleClick();
    this._bindInputChange();
  }

  updateValue(value: number | number[]): void {
    const { isVertical } = this._viewState;
    const { _modelState: modelState, _viewState: viewState } = this;
    const { minValue, maxValue, range } = modelState;
    const { input, firstPin, secondPin, bar } = this._objects;

    const sliderSize = isVertical ? Number(bar.element.clientHeight) : Number(bar.element.clientWidth);
    if (range) {
      const pins = [1, 2];
      const pxNums = pins.map((el, idx) =>
        calculatePxNum({ value: (value as number[])[idx], minValue, maxValue, elementSize: sliderSize }),
      );

      firstPin.updateValue(pxNums[0], (value as number[])[0]);
      secondPin.updateValue(pxNums[1], (value as number[])[1]);
    } else {
      const pxNum = calculatePxNum({ value: value as number, minValue, maxValue, elementSize: sliderSize });
      firstPin.updateValue(pxNum, value as number);
    }

    input.value = value;
    this._modelState.value = value;

    const dataAttributes = { ...modelState, ...viewState };

    for (const option in dataAttributes) {
      if (option !== 'sliderSize')
        this._element.setAttribute(
          `data-${camelToHyphen(option)}`,
          String(dataAttributes[option as keyof ModelState | keyof ViewState]),
        );
    }
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

    this._sliderSize = sliderSize && Math.max(Number(sliderSize.height), Number(sliderSize.width));

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
    bar.element.append(firstPin.element);
    if (range) {
      bar.element.append(secondPin.element);
    }
    this._element.append(bar.element);

    if (scale) this._element.append(scale.element);

    this.bindListeners();
  }

  private _applyToCorrectPin(value: number): number[] {
    const { firstPin, secondPin } = this._objects;
    const pinValues = [firstPin.value, secondPin.value];
    const FIRST_PIN = 0;
    const SECOND_PIN = 1;
    const chosenPin = Math.abs(value - firstPin.value) < Math.abs(value - secondPin.value) ? FIRST_PIN : SECOND_PIN;
    pinValues[chosenPin] = value;
    return pinValues;
  }

  private _bindInputChange(): void {
    const input: InputView = this._objects.input;
    input.element.onchange = (e): void => {
      const target = e.target as HTMLInputElement;
      const newValue: number | number[] = this._modelState.range
        ? target.value.split(',').map(el => Number(el.trim()))
        : Number(target.value);
      this.emit(EventTypes.valueChanged, { value: newValue });
    };
  }

  private _bindScaleClick(): void {
    const { scale } = this._objects;
    if (scale) {
      const handleScaleClick = ({ value }: { value: number }): void => {
        const { range } = this._modelState;

        this.emit(EventTypes.valueChanged, { value: range ? this._applyToCorrectPin(value) : value });
      };
      scale.on(EventTypes.newScaleValue, handleScaleClick);
    }
  }

  private _bindMovePin(): void {
    const { range } = this._modelState;
    const { firstPin, secondPin } = this._objects;

    this._bindListenersToPin(firstPin);
    if (range) this._bindListenersToPin(secondPin);
  }

  private _bindBarClick(): void {
    const { isVertical } = this._viewState;
    const { minValue, maxValue, range } = this._modelState;

    const handleBarClick = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      const percentage = isVertical
        ? (target.getBoundingClientRect().height - e.offsetY) / target.getBoundingClientRect().height
        : e.offsetX / target.getBoundingClientRect().width;

      const newValue = calculateValue({ percentage, minValue, maxValue });

      if (range) {
        const updatedValues = this._applyToCorrectPin(newValue);
        const updatedPinKey = (this._modelState.value as number[])[0] === updatedValues[0] ? 'secondPin' : 'firstPin';
        const updatedPin = this._objects[updatedPinKey];
        this.emit(EventTypes.valueChanged, { value: updatedValues });
        this._handleMouseDown(e, updatedPin);
      } else {
        this.emit(EventTypes.valueChanged, { value: newValue });
        this._handleMouseDown(e, this._objects.firstPin);
      }
    };

    this._objects.bar.handleBarClick = handleBarClick;
  }

  private _bindListenersToPin(pin: PinView): void {
    const handleMouseDown = (event: MouseEvent): void => this._handleMouseDown(event, pin);
    pin.element.addEventListener('mousedown', handleMouseDown);
  }

  private _handleMouseDown(event: MouseEvent, pin: PinView): void {
    event.preventDefault();

    const { isVertical } = this._viewState;
    const target = event.target as HTMLElement;
    let shift = isVertical ? event.offsetY : event.clientX - target.getBoundingClientRect().left;

    const tooltipShift = isVertical
      ? target.getBoundingClientRect().height - event.offsetY
      : target.getBoundingClientRect().width - event.offsetX;

    shift -= tooltipShift;

    if (target.classList.contains('js-slider-bar')) {
      shift = 0;
    }

    const mouseMoveData: MouseMoveData = {
      pin,
      shift,
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
    const { pin, shift } = data;
    const slider = this._objects.bar.element;

    let newValue = isVertical
      ? -(e.clientY - shift / 2 - slider.getBoundingClientRect().bottom)
      : e.clientX - shift / 2 - slider.getBoundingClientRect().left;

    const sliderSize = isVertical ? slider.offsetHeight : slider.offsetWidth;
    if (newValue < 0) newValue = 0;
    const rightEdge = sliderSize;
    if (newValue > rightEdge) newValue = rightEdge;

    const percentage = newValue / sliderSize;

    const calculatedValue = calculateValue({ percentage, minValue, maxValue });
    let resultValue = value;
    if (range) {
      (resultValue as number[])[pin.pinNumber - 1] = calculatedValue;
    } else {
      resultValue = calculatedValue;
    }

    this.emit(EventTypes.valueChanged, { value: resultValue });
  }
}
