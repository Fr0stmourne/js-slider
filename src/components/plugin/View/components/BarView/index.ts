import calculateValue from '../../utils/calculateValue';
import render from '../../utils/render';
import { EventTypes, BarData } from '../../../types';
import DefaultView from '../DefaultView';

class BarView extends DefaultView {
  minValue: number;
  maxValue: number;
  isVertical: boolean;

  constructor({ minValue, maxValue, isVertical }: BarData) {
    super();
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.isVertical = isVertical;
    this.render();
  }

  render(): void {
    this._element = render(
      `
      <div class="slider-plugin__bar js-slider-bar"></div>
      `,
    );

    const handleBarClick = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      const { minValue, maxValue, isVertical } = this;
      const isPin = target.classList.contains('js-slider-pin');
      const isTooltip = target.classList.contains('js-slider-value');

      if (!isPin && !isTooltip) {
        const target = e.target as HTMLElement;
        const percentage = isVertical
          ? (target.getBoundingClientRect().height - e.offsetY) / target.getBoundingClientRect().height
          : e.offsetX / target.getBoundingClientRect().width;

        const newValue = calculateValue({ percentage, minValue, maxValue });
        this.emit(EventTypes.NewBarValue, { e, value: newValue });
      }
    };

    this._element.addEventListener('mousedown', handleBarClick);
  }
}

export default BarView;
