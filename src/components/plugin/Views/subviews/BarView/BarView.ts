import render from '../../../utils/render/render';
import DefaultView from '../DefaultView/DefaultView';

export default class BarView extends DefaultView {
  onBarClick: Function;

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
      if ((e.target as HTMLElement).classList.contains('js-scale')) console.log(234);

      this.onBarClick(e);
    };

    this._element.addEventListener('click', handleBarClick);
  }
}
