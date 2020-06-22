import render from 'View/utils/render';
import DefaultView from '../DefaultView';

class PinView extends DefaultView {
  private elements!: { pin: HTMLElement; tooltip: HTMLElement };

  constructor(
    public pinNumber: number,
    private value: number,
    private isTooltipDisabled: boolean,
    private isVertical: boolean,
    private sliderSize: number,
  ) {
    super();

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
      sliderSize,
      elements: { pin },
    } = this;
    pin.style[isVertical ? 'bottom' : 'left'] = `${(value / sliderSize) * 100}%`;
  }
}

export default PinView;
