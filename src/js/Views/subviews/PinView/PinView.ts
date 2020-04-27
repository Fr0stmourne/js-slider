import DefaultView from '../DefaultView/DefaultView';
import render from '../../../utils/render/render';

export default class PinView extends DefaultView {
  pinNumber: number;
  isTooltipDisabled: boolean;
  _value: number;
  isVertical: boolean;
  _elements: { pin: HTMLElement; tooltip: HTMLElement };

  constructor(options: any, pinNumber: number) {
    super();
    this.pinNumber = pinNumber;
    this.isTooltipDisabled = options.isTooltipDisabled;
    this.isVertical = options.isVertical;
    this._value = options.defaultValue;

    this.render();
  }

  get value(): number {
    return +this._elements.tooltip.textContent.trim();
  }

  updateValue(pxNum: number, value: number): void {
    this._movePin(pxNum);

    this._elements.tooltip.textContent = String(value);
  }

  render(): void {
    this._element = render(
      `
      <div class="slider-plugin__pin js-slider-pin-${this.pinNumber}">
        <div class="slider-plugin__value ${
          this.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''
        } js-slider-value">${this._value}</div>
      </div>
      `,
    );

    this._elements = {
      pin: this._element,
      tooltip: this._element.querySelector(`.js-slider-value`),
    };
  }

  _movePin(value: number): void {
    this._elements.pin.style[this.isVertical ? 'bottom' : 'left'] = value + 'px';
  }
}
