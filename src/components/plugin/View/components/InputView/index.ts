import render from 'View/utils/render';
import DefaultView from '../DefaultView';

class InputView extends DefaultView {
  constructor(private defaultValue: number | number[]) {
    super();
    this.render();
  }

  set value(value: number[] | number) {
    const input = this.element as HTMLInputElement;
    input.value = String(value);
  }

  get value(): number | number[] {
    const inputVal = (this.element as HTMLInputElement).value;
    return !Number.isNaN(Number(inputVal)) ? Number(inputVal) : inputVal.split(',').map(el => Number(el));
  }

  render(): void {
    this.element = render(
      `
      <input class="slider-plugin__input js-input" value="${this.defaultValue}">
      `,
    );
  }
}

export default InputView;
