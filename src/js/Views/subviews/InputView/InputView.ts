import DefaultView from '../DefaultView/DefaultView';
import render from '../../../utils/render/render';

export default class InputView extends DefaultView {
  _value: number;
  constructor(defaultValue: number) {
    super();
    this._value = defaultValue;
    this.render();
  }

  setValue(value: number[] | number): void {
    (this._element as HTMLInputElement).value = String(value);
  }

  render(): void {
    this._element = render(
      `
      <input class="slider-plugin__input js-input" value="${this._value}">
      `,
    );
  }
}
