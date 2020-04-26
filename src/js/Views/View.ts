import calculatePxNum from '../utils/calculatePxNum/calculatePxNum';
import movePin from '../utils/movePin/movePin';
import calculateValue from '../utils/calculateValue/calculateValue';
import PinView from './PinView';
import BarView from './BarView';
import InputView from './InputView';

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
  _objects: { bar: BarView; firstPin: PinView; secondPin?: PinView; input: InputView };

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

  bindMovePin(valueHandler?: Function | Function[]): void {
    const slider: HTMLElement = this._elements.bar;

    const addPin = (pin: HTMLElement, handler?: Function): void => {
      pin.onmousedown = (event): void => {
        event.preventDefault();
        const shift = this._options.isVertical
          ? event.clientY - pin.getBoundingClientRect().bottom
          : event.clientX - pin.getBoundingClientRect().left;

        const onMouseMove = (e: MouseEvent): void => {
          let newValue = this._options.isVertical
            ? -(e.clientY - shift - slider.getBoundingClientRect().bottom)
            : e.clientX - shift - slider.getBoundingClientRect().left;

          const sliderSize = this._options.isVertical ? slider.offsetHeight : slider.offsetWidth;
          if (newValue < 0) newValue = 0;
          const rightEdge = sliderSize;
          if (newValue > rightEdge) newValue = rightEdge;

          const percentage = (newValue / sliderSize).toFixed(2);
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
      const firstPin: HTMLElement = this._element.querySelector('.js-slider-pin-1');
      const secondPin: HTMLElement = this._element.querySelector('.js-slider-pin-2');
      addPin(firstPin, (valueHandler as Function[])[0]);
      addPin(secondPin, (valueHandler as Function[])[1]);
    } else {
      const pin: HTMLElement = this._element.querySelector('.js-slider-pin-1');
      addPin(pin, valueHandler as Function);
    }
  }

  newBindMovePin(valueHandler?: Function | Function[]): void {
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

          const percentage = (newValue / sliderSize).toFixed(2);
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
      // TODO
      // const firstPin: HTMLElement = this._element.querySelector('.js-slider-pin-1');
      // const secondPin: HTMLElement = this._element.querySelector('.js-slider-pin-2');
      // addPin(firstPin, (valueHandler as Function[])[0]);
      // addPin(secondPin, (valueHandler as Function[])[1]);
      addPin(this._objects.firstPin, (valueHandler as Function[])[0]);
      addPin(this._objects.secondPin, (valueHandler as Function[])[1]);
    } else {
      // const pin: HTMLElement = this._element.querySelector('.js-slider-pin-1');
      addPin(this._objects.firstPin, valueHandler as Function);
    }
  }

  updateValue(value: number | number[]): void {
    if (this._options.range) {
      (value as number[]).forEach(el => {
        if (el < this._options.minValue || el > this._options.maxValue)
          throw new Error('value is not in [min, max] interval');
      });

      const pxNums = [
        calculatePxNum(
          (value as number[])[0],
          this._options.minValue,
          this._options.maxValue,
          this._options.isVertical ? +this._elements.bar.clientHeight : +this._elements.bar.clientWidth,
        ),
        calculatePxNum(
          (value as number[])[1],
          this._options.minValue,
          this._options.maxValue,
          this._options.isVertical ? +this._elements.bar.clientHeight : +this._elements.bar.clientWidth,
        ),
      ];

      this._elements.firstValue.textContent = String((value as number[])[0]);
      this._elements.secondValue.textContent = String((value as number[])[1]);

      movePin(this._elements.firstPin, pxNums[0], this._options.isVertical);
      movePin(this._elements.secondPin, pxNums[1], this._options.isVertical);
    } else {
      if (value < this._options.minValue || value > this._options.maxValue)
        throw new Error('value is not in [min, max] interval');
      const pxNum = calculatePxNum(
        value as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._elements.bar.clientHeight : +this._elements.bar.clientWidth,
      );
      this._elements.firstValue.textContent = String(value);
      movePin(this._elements.firstPin, pxNum, this._options.isVertical);
    }
    this._elements.input.value = String(value);
  }

  NewUpdateValue(value: number | number[]): void {
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
      // this._objects.firstPin.updateValue(100, (value as number[])[0]);
      this._objects.secondPin.updateValue(pxNums[1], (value as number[])[1]);
      // this._objects.secondPin.updateValue(200, (value as number[])[1]);
      // const pxNums = pinNums.map(num => calculatePxNum())

      // TODO !!!
    } else {
      const pxNum = calculatePxNum(
        value as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._objects.bar.element.clientHeight : +this._objects.bar.element.clientWidth,
      );
      this._objects.firstPin.updateValue(pxNum, value as number);
    }

    this._objects.input.setValue(value);
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

    if (this._options.range) {
      this._objects.secondPin = new PinView(this._options, 2);
    }
    Object.values(this._objects).forEach(node => {
      this._element.append(node.element);
    });
  }
}
