import DefaultView from '../DefaultView/DefaultView';
import render from '../../../utils/render/render';

export default class InputView extends DefaultView {
  _value: number;
  constructor(defaultValue: number) {
    super();
    this._value = defaultValue;
    this.render();
  }

  set value(value: number[] | number) {
    (this._element as HTMLInputElement).value = String(value);

    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);
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
