import { PinData } from 'types';
import render from '../../utils/render';
import DefaultView from '../DefaultView';

class PinView extends DefaultView {
  pinNumber: number;
  isTooltipDisabled: boolean;
  isVertical: boolean;
  private value: number;
  private elements!: { pin: HTMLElement; tooltip: HTMLElement };

  constructor(options: PinData) {
    super();
    this.pinNumber = options.pinNumber;
    this.isTooltipDisabled = options.isTooltipDisabled;
    this.isVertical = options.isVertical;
    this.value = options.value;

    this.render();
  }

  getValue(): number {
    return Number(this.elements.tooltip.textContent?.trim());
  }

  updateValue(pxNum: number, value: number): void {
    this.movePin(pxNum);

    this.elements.tooltip.textContent = String(value);
  }

  render(): void {
    this.element = render(
      `
      <div class="slider-plugin__pin js-slider-pin js-slider-pin-${this.pinNumber}">
        <div class="slider-plugin__value ${
          this.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''
        } js-slider-value">${this.value}</div>
      </div>
      `,
    );

    this.elements = {
      pin: this.element,
      tooltip: this.element.querySelector(`.js-slider-value`) as HTMLElement,
    };
  }

  private movePin(value: number): void {
    const {
      isVertical,
      elements: { pin },
    } = this;
    pin.style[isVertical ? 'bottom' : 'left'] = `${value}px`;
  }
}

export default PinView;
