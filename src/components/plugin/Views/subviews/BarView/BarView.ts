import render from '../../../utils/render/render';
import DefaultView from '../DefaultView/DefaultView';

export default class BarView extends DefaultView {
  handleBarClick: (e: Event) => void;

  constructor() {
    super();
    this.render();
  }

  render(): void {
    this._element = render(
      `
      <div class="slider-plugin__bar js-slider-bar"></div>
      `,
    );

    const handleBarClick = (e: Event): void => {
      const target = e.target as HTMLElement;
      const isPin = target.classList.contains('js-slider-pin');
      const isTooltip = target.classList.contains('js-slider-value');
      if (!isPin && !isTooltip) {
        this.handleBarClick(e);
      }
    };

    this._element.addEventListener('mousedown', handleBarClick);
  }
}
