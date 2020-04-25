import DefaultView from './DefaultView';
import render from '../utils/render/render';

export default class BarView extends DefaultView {
  constructor() {
    super();
  }

  render() {
    this._element = render(
      `
      <div class="slider-plugin__bar js-slider-bar"></div>
      `,
    );
  }
}
