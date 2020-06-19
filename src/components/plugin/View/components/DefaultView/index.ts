import Observer from '../../../Observer';

class DefaultView extends Observer {
  protected _element: HTMLElement;

  get element(): HTMLElement {
    return this._element;
  }

  render(): void {
    // set _element
  }
}

export default DefaultView;
