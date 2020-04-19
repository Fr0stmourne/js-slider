function render (markup: string) : HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = markup.trim();
  return  <HTMLElement>wrapper.firstChild;
}

export default class View {
  _element: HTMLElement;
  _options: any;


  constructor(config: any) {
    this._options = config;
    this.render(0);
  }

  get element() {
    return this._element;
  }

  bindMovePin(handler?: Function) {    
    const pin: HTMLElement = this._element.querySelector('.js-slider-pin');
    const slider: HTMLElement = this._element;
    
    if (this._options.isVertical) {
      pin.onmousedown = (event) => {
        event.preventDefault();
        
        let shiftY = event.clientY - pin.getBoundingClientRect().bottom;
        
        const onMouseMove = (e: MouseEvent) => {
          
          let newBottom = -(e.clientY - shiftY - slider.getBoundingClientRect().bottom);
  
          if (newBottom < 0) {
            newBottom = 0;
          }
          let rightEdge = slider.offsetHeight;
          
          if (newBottom > rightEdge) {
            newBottom = rightEdge;
          }
          
          const height = slider.clientHeight;
          const percentage = (newBottom / height).toFixed(2);
         
          if (handler) handler(percentage);          
          pin.style.bottom = newBottom + 'px';
        }
  
        const onMouseUp = (e: MouseEvent) => {
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
        }
  
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }
    } else {
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
          const percentage = (newLeft / width).toFixed(2);
         
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
    
  }

  updateValue(value: number) {     
    this._element.querySelector('.js-slider-value').textContent = String(value);    
  }

  render(value: number) {
    this._element = render(`
    <div class="slider-plugin js-slider ${this._options.isVertical ? 'slider-plugin--vertical' : ''}">
      <div class="slider-plugin__bar"></div>
      <div class="slider-plugin__pin js-slider-pin">
        <div class="slider-plugin__value ${this._options.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''} js-slider-value">${value}</div>
      </div>
    </div>
    `);
    
    // used append-remove trick to calculate element width
    document.body.appendChild(this._element);
    const firstVal = this._options.defaultValue / (this._options.maxValue - this._options.minValue) * (this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth);
    document.body.removeChild(this._element);
    (<HTMLElement>this._element.querySelector('.js-slider-pin')).style[this._options.isVertical ? 'bottom' : 'left'] = firstVal + 'px';
  }
}
