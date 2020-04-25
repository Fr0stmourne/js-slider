import calculatePxNum from '../utils/calculatePxNum/calculatePxNum';
import movePin from '../utils/movePin/movePin';
import calculateValue from '../utils/calculateValue/calculateValue';
import PinView from './PinView';
import BarView from './BarView';

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

  constructor(config: any) {
    this._options = config;
    this.render(this._options.range ? [this._options.minValue, this._options.maxValue] : this._options.minValue);
  }

  get element(): HTMLElement {
    return this._element;
  }

  bindInputChange(handler?: Function): void {
    const input: HTMLInputElement = this._elements.input;
    input.onchange = (e): void => {
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

  render(value: number | number[]): void {
    this._element = render(
      `
    <div class="slider-plugin js-slider ${this._options.isVertical ? 'slider-plugin--vertical' : ''}">
      <input class="slider-plugin__input js-input" value="${this._options.defaultValue}">
    </div>
    `,
    );
    this._element.append(new BarView().element);
    this._element.append(new PinView(this._options, 1).element);
    if (this._options.range) {
      this._element.append(new PinView(this._options, 2).element);
    }

    if (this._options.range) {
      //   this._element = render(`
      //   <div class="slider-plugin js-slider ${this._options.isVertical ? 'slider-plugin--vertical' : ''}">
      //   <div class="slider-plugin__bar js-slider-bar"></div>
      //   <div class="slider-plugin__pin js-slider-pin js-slider-pin-1">
      //     <div class="slider-plugin__value ${
      //       this._options.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''
      //     } js-slider-value">${(value as number[])[0]}</div>
      //   </div>
      //   <div class="slider-plugin__pin slider-plugin__pin--second js-slider-pin-2">
      //     <div class="slider-plugin__value ${
      //       this._options.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''
      //     } js-slider-value">${(value as number[])[1]}</div>
      //   </div>
      //   <input class="slider-plugin__input js-input" value="${this._options.defaultValue}">
      // </div>
      //   `);

      // const first = new PinView(this._options, 1);
      // const pin = new PinView(this._options, 1);

      // this._element.append(bar.element as Node);
      // this._element.append(pin.element as Node);

      this._elements = {
        bar: this._element.querySelector('.js-slider-bar'),
        firstPin: this._element.querySelector('.js-slider-pin-1'),
        secondPin: this._element.querySelector('.js-slider-pin-2'),
        firstValue: this._element.querySelector('.js-slider-pin-1 .js-slider-value'),
        secondValue: this._element.querySelector('.js-slider-pin-2 .js-slider-value'),
        input: this._element.querySelector('.js-input'),
      };

      document.body.appendChild(this._element);
      const firstInitialVal = calculatePxNum(
        this._options.defaultValue[0] as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._elements.bar.clientHeight : +this._elements.bar.clientWidth,
      );
      const secondInitialVal = calculatePxNum(
        this._options.defaultValue[1] as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._elements.bar.clientHeight : +this._elements.bar.clientWidth,
      );
      document.body.removeChild(this._element);

      movePin(this._elements.firstPin, firstInitialVal, this._options.isVertical);
      movePin(this._elements.secondPin, secondInitialVal, this._options.isVertical);
    } else {
      this._elements = {
        bar: this._element.querySelector('.js-slider-bar'),
        firstPin: this._element.querySelector('.js-slider-pin-1'),
        firstValue: this._element.querySelector('.js-slider-pin-1 .js-slider-value'),
        input: this._element.querySelector('.js-input'),
      };

      // used append-remove trick to calculate element width
      document.body.appendChild(this._element);
      const initialVal = calculatePxNum(
        this._options.defaultValue as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._elements.bar.clientHeight : +this._elements.bar.clientWidth,
      );
      document.body.removeChild(this._element);

      movePin(this._elements.firstPin, initialVal, this._options.isVertical);
    }
  }
}
