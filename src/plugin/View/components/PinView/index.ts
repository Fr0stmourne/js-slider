import render from 'View/utils/render';

import DefaultView from '../DefaultView';

class PinView extends DefaultView {
  private elements!: { pin: HTMLElement; tooltip: HTMLElement };

  constructor(
    public pinNumber: number,
    private value: number,
    private isTooltipDisabled: boolean,
    private isVertical: boolean,
    private container: HTMLElement,
  ) {
    super();

    this.render();
  }

  getValue(): number {
    return Number(this.elements.tooltip.textContent?.trim());
  }

  updateValue(pxValue: number, value: number): void {
    this.movePin(pxValue);

    this.elements.tooltip.textContent = String(value);
  }

  render(): void {
    this.element = render(
      `
      <div class="slider-plugin__pin js-slider-pin js-slider-pin-${this.pinNumber}">
        <div class="slider-plugin__value ${
          this.isTooltipDisabled ? 'slider-plugin__value_hidden' : ''
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
      container,
    } = this;

    const sliderSize = Math.max(container.clientWidth, container.clientHeight);
    pin.style[isVertical ? 'bottom' : 'left'] = `${(value / sliderSize) * 100}%`;
  }
}

export default PinView;
