import DefaultView from '../DefaultView/DefaultView';
import render from '../../../utils/render/render';

export default class InputView extends DefaultView {
  _value: number | number[];
  constructor(defaultValue: number | number[]) {
    super();
    this._value = defaultValue;
    this.render();
  }

  set value(value: number[] | number) {
    const input = this._element as HTMLInputElement;
    input.value = String(value);

    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('blur', false, true);
    this._element.dispatchEvent(evt);
  }

  get value(): number | number[] {
    const inputVal = (this._element as HTMLInputElement).value;
    return !Number.isNaN(+inputVal) ? +inputVal : inputVal.split(',').map(el => +el);
  }

  render(): void {
    this._element = render(
      `
      <input class="slider-plugin__input js-input" value="${this._value}">
      `,
    );
  }
}
