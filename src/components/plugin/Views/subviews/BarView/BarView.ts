import render from '../../../utils/render/render';
import DefaultView from '../DefaultView/DefaultView';

export default class BarView extends DefaultView {
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
  }
}
