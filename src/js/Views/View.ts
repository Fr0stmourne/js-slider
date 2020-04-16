function render (markup: string) : DocumentFragment {
  const wrapper = document.createElement('template');
  wrapper.innerHTML = markup.trim();
  return wrapper.content;
}

export default class View {
  _element: DocumentFragment;

  constructor() {

  }

  get element() {
    if (this._element) {
      return this._element;
    }

    this._element = this.render();
    this.bind(this._element);
    return this._element;
  }

  bind(_element: DocumentFragment) {

  }

  render() {
    return render(`
    <div class="slider-plugin">
      <div class="slider-plugin__bar"></div>
      <div class="slider-plugin__pin">
        <div class="slider-plugin__text">123</div>
      </div>
    </div>
    `)
  }
}
