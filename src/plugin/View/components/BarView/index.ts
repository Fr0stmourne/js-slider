import { EventTypes } from 'types';
import calculateValue from 'View/utils/calculateValue';
import render from 'View/utils/render';

import DefaultView from '../DefaultView';

class BarView extends DefaultView {
  constructor(private minValue: number, private maxValue: number, private isVertical: boolean) {
    super();
    this.render();
  }

  render(): void {
    this.element = render(
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

    this.element.addEventListener('mousedown', handleBarClick);
  }
}

export default BarView;
