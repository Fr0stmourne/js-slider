import { DEFAULT_VIEW_STATE } from 'defaults';
import { ViewState, ModelState, Objects, MouseMoveData, EventTypes } from 'types';

import Observer from '../Observer';
import BarView from './components/BarView';
import InputView from './components/InputView';
import PinView from './components/PinView';
import ProgressView from './components/ProgressView';
import ScaleView from './components/ScaleView';
import calculatePxValue from './utils/calculatePxValue';
import calculateValue from './utils/calculateValue';
import camelToHyphen from './utils/camelToHyphen';
import render from './utils/render';

class View extends Observer {
  private sliderSize!: number;
  private element!: HTMLElement;
  private objects!: Objects;

  constructor(private modelState: ModelState, private viewState: ViewState = DEFAULT_VIEW_STATE) {
    super();
    this.init(viewState);
  }

  init(viewState: ViewState): void {
    this.viewState = { ...DEFAULT_VIEW_STATE, ...viewState };
    this.render();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getObjects(): Objects {
    return this.objects;
  }

  getState(): { viewState: ViewState; modelState: ModelState } {
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
    const { minValue, maxValue, range } = modelState;
    const { input, firstPin, secondPin, bar, progress } = this.objects;

    const sliderSize = isVertical ? bar.element.clientHeight : bar.element.clientWidth;
    if (range) {
      const pins = [1, 2];
      const pxValues = pins.map((el, index) =>
        calculatePxValue({ value: value[index], minValue, maxValue, elementSize: sliderSize }),
      );

      firstPin.updateValue(pxValues[0], value[0]);
      secondPin?.updateValue(pxValues[1], value[1]);
      progress?.setWidth(((pxValues[1] - pxValues[0]) / sliderSize) * 100);
      progress?.setPadding((pxValues[0] / sliderSize) * 100);
    } else {
      const pxValue = calculatePxValue({ value: value[0], minValue, maxValue, elementSize: sliderSize });
      firstPin.updateValue(pxValue, value[0]);
      progress?.setWidth((pxValue / sliderSize) * 100);
    }

    input.setValue(value);
    this.modelState.value = value;

    const dataAttributes = { ...modelState, ...viewState };

    (Object.keys(dataAttributes) as Array<keyof typeof dataAttributes>).forEach(option => {
      if (option !== 'container')
        this.element.setAttribute(`data-${camelToHyphen(option)}`, String(dataAttributes[option]));
    });
  }

  render(): void {
    const { isVertical, milestonesNumber, isTooltipDisabled, container, showProgress } = this.viewState;
    const { value, minValue, maxValue, range, steps } = this.modelState;
    this.element = render(
      `
    <div class="slider-plugin js-slider ${isVertical ? 'slider-plugin--vertical' : ''}">
    </div>
    `,
    );

    this.sliderSize = container && Math.max(container.clientHeight, container.clientWidth);

    this.objects = {
      bar: new BarView(minValue, maxValue, isVertical),
      firstPin: new PinView(1, value[0], isTooltipDisabled, isVertical, container),
      input: new InputView(value),
    };

    if (milestonesNumber && this.sliderSize) {
      this.objects.scale = new ScaleView(milestonesNumber, isVertical, steps, minValue, maxValue, this.sliderSize);
    }

    if (showProgress) {
      this.objects.progress = new ProgressView(isVertical);
    }

    if (range) {
      this.objects.secondPin = new PinView(2, value[1], isTooltipDisabled, isVertical, container);
    }

    const { firstPin, secondPin, scale, bar, input, progress } = this.objects;
    bar.element.append(firstPin.element);
    if (progress) {
      bar.element.append(progress.element);
    }
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

    const handleBarClick = ({ event, value }: { event: MouseEvent; value: number }): void => {
      const { firstPin, secondPin } = this.objects;
      if (range && secondPin) {
        const prevValues = [firstPin.getValue(), secondPin.getValue()];
        const updatedValues = this.applyToCorrectPin(value);
        const updatedPin = prevValues[0] === updatedValues[0] ? secondPin : firstPin;
        this.emit(EventTypes.ValueChanged, { value: updatedValues });

        this.handleMouseDown(event, updatedPin);
      } else {
        this.emit(EventTypes.ValueChanged, { value: [value] });
        this.handleMouseDown(event, firstPin);
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

    const handleMouseMove = (event: MouseEvent): void => this.handleMouseMove(event, mouseMoveData);

    const handleMouseUp = (): void => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  private handleMouseMove(event: MouseEvent, data: MouseMoveData): void {
    const { isVertical } = this.viewState;
    const { minValue, maxValue, range, value } = this.modelState;
    const { pin, shift } = data;
    const slider = this.objects.bar.element;

    let newValue = isVertical
      ? -(event.clientY - shift / 2 - slider.getBoundingClientRect().bottom)
      : event.clientX - shift / 2 - slider.getBoundingClientRect().left;

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
