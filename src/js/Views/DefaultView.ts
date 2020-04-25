export default class DefaultView {
  _element: HTMLElement;
  constructor() {
    this.render();
  }

  get element(): HTMLElement {
    return this._element;
  }

  render(): void {
    // set _element
  }
}
