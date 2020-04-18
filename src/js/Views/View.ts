function render (markup: string) : HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = markup.trim();
  return  <HTMLElement>wrapper.firstChild;
}

export default class View {
  _element: HTMLElement;
  handler: Function;
  options: any;


  constructor(config: any) {
    this.options = config;
    this.render(0);
  }

  get element() {
    return this._element;
  }

  bindMovePin(handler?: Function) {    
    const pin: HTMLElement = this._element.querySelector('.js-slider-pin');
    const slider: HTMLElement = this._element;
    console.log(this._element);
    

    pin.onmousedown = (event) => {
      event.preventDefault();

      let shiftX = event.clientX - pin.getBoundingClientRect().left;

      const onMouseMove = (e: MouseEvent) => {
        
        let newLeft = e.clientX - shiftX - slider.getBoundingClientRect().left;

        if (newLeft < 0) {
          newLeft = 0;
        }
        let rightEdge = slider.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
        
        const width = slider.clientWidth;
        const percentage = ((newLeft + 1) / width).toFixed(2);
       
        if (handler) handler(percentage);
        
        pin.style.left = newLeft + 'px';
      }

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  }

  updateValue(value: number) {     
    this._element.querySelector('.js-slider-value').textContent = String(Math.round(value));
  }

  render(value: number) {
    this._element = render(`
    <div class="slider-plugin js-slider">
      <div class="slider-plugin__bar"></div>
      <div class="slider-plugin__pin js-slider-pin">
        <div class="slider-plugin__value js-slider-value">${value}</div>
      </div>
    </div>
    `);

    // used append-remove trick to calculate element width
    document.body.appendChild(this._element);
    const firstVal = this.options.defaultValue / (this.options.maxValue - this.options.minValue) * +this._element.clientWidth;
    document.body.removeChild(this._element);

    (<HTMLElement>this._element.querySelector('.js-slider-pin')).style.left = firstVal + 'px';
  }
}
