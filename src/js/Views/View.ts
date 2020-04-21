import calculatePxNum from '../utils/calculatePxNum/calculatePxNum';
import movePin from '../utils/movePin/movePin';

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
  };

  constructor(config: any) {
    this._options = config;
    this.render(this._options.range ? [0, 5] : 0);
  }

  get element(): HTMLElement {
    return this._element;
  }

  bindInputChange(handler?: Function): void {
    const input: HTMLInputElement = this._element.querySelector('.js-input');
    input.onchange = (e): void => handler(e);
  }

  bindMovePin(valueHandler?: Function | Function[]): void {
    const slider: HTMLElement = this._element;

    const addPin = (pin: HTMLElement, handler?: Function, pinShift?: number): void => {
      if (this._options.isVertical) {
        const DEFAULT_PIN_SHIFT = 0;
        pin.onmousedown = (event): void => {
          event.preventDefault();

          const shiftY = event.clientY - pin.getBoundingClientRect().bottom;

          const onMouseMove = (e: MouseEvent): void => {
            let newBottom = -(
              e.clientY -
              shiftY -
              slider.getBoundingClientRect().bottom +
              // fix for vertical slider bug
              (pinShift || DEFAULT_PIN_SHIFT)
            );

            if (newBottom < 0) {
              newBottom = 0;
            }
            const rightEdge = slider.offsetHeight;

            if (newBottom > rightEdge) {
              newBottom = rightEdge;
            }

            const height = slider.clientHeight;
            const percentage = (newBottom / height).toFixed(2);
            if (handler) handler(percentage);
            // pin.style.bottom = newBottom + 'px';
          };

          const onMouseUp = (): void => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        };
      } else {
        pin.onmousedown = (event): void => {
          // debugger;
          event.preventDefault();

          const shiftX = event.clientX - pin.getBoundingClientRect().left;

          const onMouseMove = (e: MouseEvent): void => {
            let newLeft = e.clientX - shiftX - slider.getBoundingClientRect().left;

            if (newLeft < 0) {
              newLeft = 0;
            }
            const rightEdge = slider.offsetWidth;
            if (newLeft > rightEdge) {
              newLeft = rightEdge;
            }

            const width = slider.clientWidth;
            const percentage = (newLeft / width).toFixed(2);

            if (handler) handler(percentage);

            // pin.style.left = newLeft + 'px';
          };

          const onMouseUp = (): void => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        };
      }
    };

    if (this._options.range) {
      const firstPin: HTMLElement = this._element.querySelector('.js-slider-pin-1');
      const secondPin: HTMLElement = this._element.querySelector('.js-slider-pin-2');
      addPin(firstPin, (valueHandler as Function[])[0], 10);
      addPin(secondPin, (valueHandler as Function[])[1]);
    } else {
      const pin: HTMLElement = this._element.querySelector('.js-slider-pin');
      addPin(pin, valueHandler as Function);
    }
  }

  updateValue(value: number | number[]): void {
    if (this._options.range) {
      const pxNums = [
        calculatePxNum(
          (value as number[])[0],
          this._options.minValue,
          this._options.maxValue,
          this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth,
        ),
        calculatePxNum(
          (value as number[])[1],
          this._options.minValue,
          this._options.maxValue,
          this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth,
        ),
      ];

      this._elements.firstValue.textContent = String((value as number[])[0]);
      this._elements.secondValue.textContent = String((value as number[])[1]);

      movePin(this._elements.firstPin, pxNums[0], this._options.isVertical);
      movePin(this._elements.secondPin, pxNums[1], this._options.isVertical);
    } else {
      const pxNum = calculatePxNum(
        value as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth,
      );
      this._elements.firstValue.textContent = String(value);
      movePin(this._elements.firstPin, pxNum, this._options.isVertical);
    }
  }

  render(value: number | number[]): void {
    if (this._options.range) {
      this._element = render(`
      <div class="slider-plugin js-slider ${this._options.isVertical ? 'slider-plugin--vertical' : ''}">
      <div class="slider-plugin__bar js-slider-bar"></div>
      <div class="slider-plugin__pin js-slider-pin js-slider-pin-1">
        <div class="slider-plugin__value ${
          this._options.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''
        } js-slider-value">${(value as number[])[0]}</div>
      </div>
      <div class="slider-plugin__pin slider-plugin__pin--second js-slider-pin-2">
        <div class="slider-plugin__value ${
          this._options.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''
        } js-slider-value">${(value as number[])[1]}</div>
      </div>
      <input class="slider-plugin__input js-input" value="${this._options.defaultValue}">
    </div>
      `);

      this._elements = {
        bar: this._element.querySelector('.js-slider-bar'),
        firstPin: this._element.querySelector('.js-slider-pin-1'),
        secondPin: this._element.querySelector('.js-slider-pin-2'),
        firstValue: this._element.querySelector('.js-slider-pin-1 .js-slider-value'),
        secondValue: this._element.querySelector('.js-slider-pin-2 .js-slider-value'),
      };

      document.body.appendChild(this._element);
      const firstInitialVal = calculatePxNum(
        this._options.defaultValue[0] as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth,
      );
      const secondInitialVal = calculatePxNum(
        this._options.defaultValue[1] as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth,
      );
      document.body.removeChild(this._element);

      movePin(this._elements.firstPin, firstInitialVal, this._options.isVertical);
      movePin(this._elements.secondPin, secondInitialVal, this._options.isVertical);
    } else {
      this._element = render(`
      <div class="slider-plugin js-slider ${this._options.isVertical ? 'slider-plugin--vertical' : ''}">
        <div class="slider-plugin__bar"></div>
        <div class="slider-plugin__pin js-slider-pin js-slider-pin-1">
          <div class="slider-plugin__value ${
            this._options.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''
          } js-slider-value">${value}</div>
        </div>
        <input type="number" class="slider-plugin__input js-input" value="${this._options.defaultValue}">
      </div>
      `);

      this._elements = {
        bar: this._element.querySelector('.js-slider-bar'),
        firstPin: this._element.querySelector('.js-slider-pin-1'),
        firstValue: this._element.querySelector('.js-slider-pin-1 .js-slider-value'),
      };

      // used append-remove trick to calculate element width
      document.body.appendChild(this._element);
      const initialVal = calculatePxNum(
        this._options.defaultValue as number,
        this._options.minValue,
        this._options.maxValue,
        this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth,
      );
      document.body.removeChild(this._element);

      movePin(this._elements.firstPin, initialVal, this._options.isVertical);
    }
  }
}
