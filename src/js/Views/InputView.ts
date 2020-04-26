import DefaultView from './DefaultView';
import render from '../utils/render/render';

export default class InputView extends DefaultView {
  constructor(public defaultValue: number) {
    super();
    this.defaultValue = defaultValue;
    this.render();
  }

  setValue(value: number[] | number) {
    (this._element as HTMLInputElement).value = String(value);
  }

  render(): void {
    this._element = render(
      `
      <input class="slider-plugin__input js-input" value="${this.defaultValue}">
      `,
    );
  }
}
