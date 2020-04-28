import calculatePxNum from '../../utils/calculatePxNum/calculatePxNum';
import calculateValue from '../../utils/calculateValue/calculateValue';
import PinView from '../subviews/PinView/PinView';
import BarView from '../subviews/BarView/BarView';
import InputView from '../subviews/InputView/InputView';
import ScaleView from '../subviews/ScaleView/ScaleView';

function render(markup: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = markup.trim();
  return wrapper.firstChild as HTMLElement;
}

export default class View {
  _element: HTMLElement;
  _options: any;
  _elements: {
    bar: HTMLElement;
    firstPin: HTMLElement;
    secondPin?: HTMLElement;
    firstValue: HTMLElement;
    secondValue?: HTMLElement;
    input: HTMLInputElement;
  };
  _objects: { bar: BarView; firstPin: PinView; secondPin?: PinView; input: InputView; scale?: ScaleView };

  constructor(config: any) {
    this._options = config;
    this.render();
  }

  get element(): HTMLElement {
    return this._element;
  }

  bindInputChange(handler?: Function): void {
    const input: InputView = this._objects.input;
    input.element.onchange = (e): void => {
      const newValue: number | number[] = this._options.range
        ? (e.target as HTMLInputElement).value.split(',').map(el => +el.trim())
        : +(e.target as HTMLInputElement).value;
      handler(newValue);
    };
  }

  bindScaleClick(handler?: Function): void {
    if (this._objects.scale) {
      if (this._options.range) {
        const rangeHandler = (value: number): void => {
          const pinValues = [this._objects.firstPin.value, this._objects.secondPin.value];
          const FIRST_PIN = 0;
          const SECOND_PIN = 1;
          pinValues[
            Math.abs(value - this._objects.firstPin.value) < Math.abs(value - this._objects.secondPin.value)
              ? FIRST_PIN
              : SECOND_PIN
          ] = value;
          handler(pinValues);
        };
        (this._objects.scale.onOptionClick as Function) = rangeHandler;
      } else {
        (this._objects.scale.onOptionClick as Function) = handler;
      }
    }
  }

  bindMovePin(valueHandler?: Function | Function[]): void {
    const slider: HTMLElement = this._objects.bar.element;

    const addPin = (pin: PinView, handler?: Function): void => {
      pin.element.onmousedown = (event): void => {
        event.preventDefault();
        const shift = this._options.isVertical
          ? event.clientY - pin.element.getBoundingClientRect().bottom
          : event.clientX - pin.element.getBoundingClientRect().left;

        const onMouseMove = (e: MouseEvent): void => {
          let newValue = this._options.isVertical
            ? -(e.clientY - shift - slider.getBoundingClientRect().bottom)
            : e.clientX - shift - slider.getBoundingClientRect().left;

          const sliderSize = this._options.isVertical ? slider.offsetHeight : slider.offsetWidth;
          if (newValue < 0) newValue = 0;
          const rightEdge = sliderSize;
          if (newValue > rightEdge) newValue = rightEdge;

          const percentage = newValue / sliderSize;
          const resultValue = calculateValue(+percentage, this._options.minValue, this._options.maxValue);

          if (handler) handler(resultValue);
        };

        const onMouseUp = (): void => {
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
    };

    if (this._options.range) {
      addPin(this._objects.firstPin, (valueHandler as Function[])[0]);
      addPin(this._objects.secondPin, (valueHandler as Function[])[1]);
    } else {
      addPin(this._objects.firstPin, valueHandler as Function);
    }
  }

  updateValue(value: number | number[]): void {
    if (this._options.range) {
      const pins = [1, 2];
      const pxNums = pins.map((el, idx) =>
        calculatePxNum(
          (value as number[])[idx],
          this._options.minValue,
          this._options.maxValue,
          this._options.isVertical ? +this._objects.bar.element.clientHeight : +this._objects.bar.element.clientWidth,
        ),
      );

      this._objects.firstPin.updateValue(pxNums[0], (value as number[])[0]);
      this._objects.secondPin.updateValue(pxNums[1], (value as number[])[1]);
    } else {
      const pxNum = calculatePxNum(
        value as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._objects.bar.element.clientHeight : +this._objects.bar.element.clientWidth,
      );
      this._objects.firstPin.updateValue(pxNum, value as number);
    }

    this._objects.input.value = value;
  }

  render(): void {
    this._element = render(
      `
    <div class="slider-plugin js-slider ${this._options.isVertical ? 'slider-plugin--vertical' : ''}">
    </div>
    `,
    );
    this._objects = {
      bar: new BarView(),
      firstPin: new PinView(this._options, 1),
      input: new InputView(this._options.defaultValue),
    };

    if (this._options.scaleOptionsNum) {
      this._objects.scale = new ScaleView(this._options);
    }

    if (this._options.range) {
      this._objects.secondPin = new PinView(this._options, 2);
    }
    Object.values(this._objects).forEach(node => {
      if (node !== this._objects.scale) this._element.append(node.element);
    });

    if (this._objects.scale) this._objects.bar.element.append(this._objects.scale.element);
  }
}
