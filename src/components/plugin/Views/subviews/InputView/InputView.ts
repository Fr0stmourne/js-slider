import render from '../../../utils/render/render';
import DefaultView from '../DefaultView/DefaultView';

export default class InputView extends DefaultView {
  private _value: number | number[];
  constructor(defaultValue: number | number[]) {
    super();
    this._value = defaultValue;
    this.render();
  }

  set value(value: number[] | number) {
    const input = this._element as HTMLInputElement;
    input.value = String(value);
  }

  get value(): number | number[] {
    const inputVal = (this._element as HTMLInputElement).value;
    return !Number.isNaN(Number(inputVal)) ? Number(inputVal) : inputVal.split(',').map(el => Number(el));
  }

  render(): void {
    this._element = render(
      `
      <input class="slider-plugin__input js-input" value="${this._value}">
      `,
    );
  }
}
