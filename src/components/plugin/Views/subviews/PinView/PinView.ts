import { PinData } from '../../../interfaces';
import render from '../../utils/render/render';
import movePin from './utils/movePin/movePin';
import DefaultView from '../DefaultView/DefaultView';

export default class PinView extends DefaultView {
  pinNumber: number;
  isTooltipDisabled: boolean;
  isVertical: boolean;
  private _value: number;
  private _elements: { pin: HTMLElement; tooltip: HTMLElement };

  constructor(options: PinData) {
    super();
    this.pinNumber = options.pinNumber;
    this.isTooltipDisabled = options.isTooltipDisabled;
    this.isVertical = options.isVertical;
    this._value = options.value;

    this.render();
  }

  get value(): number {
    return Number(this._elements.tooltip.textContent.trim());
  }

  updateValue(pxNum: number, value: number): void {
    this._movePin(pxNum);

    this._elements.tooltip.textContent = String(value);
  }

  render(): void {
    this._element = render(
      `
      <div class="slider-plugin__pin js-slider-pin js-slider-pin-${this.pinNumber}">
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

  private _movePin(value: number): void {
    const { isVertical } = this;
    movePin({ pinElement: this._elements.pin, value, isVertical });
  }
}
