import calculatePxNum from './utils/calculatePxNum';
import calculateValue from './utils/calculateValue';
import camelToHyphen from './utils/camelToHyphen';
import render from './utils/render';
import PinView from './components/PinView';
import BarView from './components/BarView';
import InputView from './components/InputView';
import ScaleView from './components/ScaleView';
import Observer from '../Observer';
import { ViewState, ModelState, PinData, ScaleData, Objects, MouseMoveData, EventTypes, BarData } from '../types';
import { DEFAULT_VIEW_STATE } from '../defaults';

class View extends Observer {
  private sliderSize!: number;
  private element!: HTMLElement;
  private viewState: ViewState;
  private modelState: ModelState;
  private objects!: Objects;

  constructor(modelState: ModelState, viewState?: ViewState) {
    super();
    this.viewState = { ...DEFAULT_VIEW_STATE, ...viewState };
    this.modelState = modelState;
    this.render();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getObjects(): Objects {
    return this.objects;
  }

  get state(): { viewState: ViewState; modelState: ModelState } {
    return {
      viewState: { ...this.viewState },
      modelState: { ...this.modelState },
    };
  }

  setState(viewState: Partial<ViewState>, modelState: ModelState): void {
    this.viewState = { ...this.viewState, ...viewState };
    this.modelState = { ...this.modelState, ...modelState };
  }

  bindListeners(): void {
    this.bindBarClick();
    this.bindMovePin();
    this.bindScaleClick();
  }

  updateValue(value: number[]): void {
    const { isVertical } = this.viewState;
    const { modelState, viewState } = this;
    // debugger;
    const isNewValueRange = value.length === 2;
    const { minValue, maxValue, range } = modelState;
    if (range === isNewValueRange) {
      const { input, firstPin, secondPin, bar } = this.objects;

      const sliderSize = isVertical ? bar.element.clientHeight : bar.element.clientWidth;
      if (range) {
        const pins = [1, 2];
        const pxNums = pins.map((el, idx) =>
          calculatePxNum({ value: value[idx], minValue, maxValue, elementSize: sliderSize }),
        );

        firstPin.updateValue(pxNums[0], value[0]);
        secondPin?.updateValue(pxNums[1], value[1]);
      } else {
        const pxNum = calculatePxNum({ value: value[0], minValue, maxValue, elementSize: sliderSize });
        firstPin.updateValue(pxNum, value[0]);
      }

      input.value = value;
      this.modelState.value = value;

      const dataAttributes = { ...modelState, ...viewState };

      Object.keys(dataAttributes).forEach((option: string) => {
        if ((option as keyof typeof dataAttributes) !== 'sliderSize')
          this.element.setAttribute(
            `data-${camelToHyphen(option)}`,
            String(dataAttributes[option as keyof ModelState | keyof ViewState]),
          );
      });
    }
  }

  render(): void {
    const { isVertical, scaleOptionsNum, isTooltipDisabled, sliderSize } = this.viewState;
    const { value, minValue, maxValue, range, step } = this.modelState;
    this.element = render(
      `
    <div class="slider-plugin js-slider ${isVertical ? 'slider-plugin--vertical' : ''}">
    </div>
    `,
    );

    this.sliderSize = sliderSize && Math.max(sliderSize.height, sliderSize.width);

    const firstPinData: PinData = {
      pinNumber: 1,
      isTooltipDisabled,
      isVertical,
      value: value[0],
    };

    const barData: BarData = {
      minValue,
      maxValue,
      isVertical,
    };

    this.objects = {
      bar: new BarView(barData),
      firstPin: new PinView(firstPinData),
      input: new InputView(value),
    };

    if (scaleOptionsNum && this.sliderSize) {
      const scaleData: ScaleData = {
        scaleOptionsNum: scaleOptionsNum,
        step,
        isVertical,
        minValue,
        maxValue,
        sliderSize: this.sliderSize,
      };
      this.objects.scale = new ScaleView(scaleData);
    }

    if (range) {
      const secondPinData: PinData = {
        pinNumber: 2,
        isTooltipDisabled,
        isVertical,
        value: value[1],
      };
      this.objects.secondPin = new PinView(secondPinData);
    }

    const { firstPin, secondPin, scale, bar, input } = this.objects;
    bar.element.append(firstPin.element);
    if (range) {
      bar.element.append(secondPin?.element as HTMLElement);
    }
    this.element.append(bar.element);
    this.element.append(input.element);

    if (scale) this.element.append(scale.element);

    this.bindListeners();
  }

  private applyToCorrectPin(value: number): number[] {
    const { firstPin, secondPin } = this.objects;
    let pinValues: number[];
    if (secondPin) {
      pinValues = [firstPin.getValue(), secondPin.getValue()];
      const chosenPin = Math.abs(value - firstPin.getValue()) < Math.abs(value - secondPin.getValue()) ? 0 : 1;
      pinValues[chosenPin] = value;
      return pinValues;
    }
    return [value];
  }

  private bindScaleClick(): void {
    const { scale } = this.objects;
    if (scale) {
      const handleScaleClick = ({ value }: { value: number }): void => {
        this.emit(EventTypes.ValueChanged, { value: this.applyToCorrectPin(value) });
      };
      scale.on(EventTypes.NewScaleValue, handleScaleClick);
    }
  }

  private bindMovePin(): void {
    const { range } = this.modelState;
    const { firstPin, secondPin } = this.objects;

    this.bindListenersToPin(firstPin);
    if (range && secondPin) this.bindListenersToPin(secondPin);
  }

  private bindBarClick(): void {
    const { range } = this.modelState;
    const { bar } = this.objects;

    const handleBarClick = ({ e, value }: { e: MouseEvent; value: number }): void => {
      const { firstPin, secondPin } = this.objects;
      if (range && secondPin) {
        const prevValues = [firstPin.getValue(), secondPin.getValue()];
        const updatedValues = this.applyToCorrectPin(value);
        const updatedPin = prevValues[0] === updatedValues[0] ? secondPin : firstPin;
        this.emit(EventTypes.ValueChanged, { value: updatedValues });

        this.handleMouseDown(e, updatedPin);
      } else {
        this.emit(EventTypes.ValueChanged, { value: [value] });
        this.handleMouseDown(e, firstPin);
      }
    };

    bar.on(EventTypes.NewBarValue, handleBarClick);
  }

  private bindListenersToPin(pin: PinView): void {
    const handleMouseDown = (event: MouseEvent): void => this.handleMouseDown(event, pin);
    pin.element.addEventListener('mousedown', handleMouseDown);
  }

  private handleMouseDown(event: MouseEvent, pin: PinView): void {
    event.preventDefault();

    const { isVertical } = this.viewState;
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

    const handleMouseMove = (e: MouseEvent): void => this.handleMouseMove(e, mouseMoveData);

    const handleMouseUp = (): void => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  private handleMouseMove(e: MouseEvent, data: MouseMoveData): void {
    const { isVertical } = this.viewState;
    const { minValue, maxValue, range, value } = this.modelState;
    const { pin, shift } = data;
    const slider = this.objects.bar.element;

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
      resultValue[pin.pinNumber - 1] = calculatedValue;
    } else {
      resultValue = [calculatedValue];
    }

    this.emit(EventTypes.ValueChanged, { value: resultValue });
  }
}

export default View;
