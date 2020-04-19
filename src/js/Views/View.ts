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
    if (this._options.range) {
      this.render([0, 5]);
    } else {
      this.render(0);
    }
  }

  get element() {
    return this._element;
  }

  bindInputChange(handler? : Function) {
    const input: HTMLInputElement = this._element.querySelector('.js-input');
    input.onchange = (e) => {
      console.log('changed!!');
      
      handler(e);
    }
  }

  bindMovePin(valueHandler?: Function | Function[]) {    
    const slider: HTMLElement = this._element;

    const addPin = (pin: HTMLElement, handler?: Function) : void => {
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
            // pin.style.bottom = newBottom + 'px';
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
            
            // pin.style.left = newLeft + 'px';
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
    
    if (this._options.range) {
      
      const firstPin : HTMLElement = this._element.querySelector('.js-slider-pin-1');
      const secondPin : HTMLElement = this._element.querySelector('.js-slider-pin-2');
      console.log(firstPin);
      addPin(firstPin, (<Function[]>valueHandler)[0]);
      addPin(secondPin, (<Function[]>valueHandler)[1]);
      

    } else {
      const pin: HTMLElement = this._element.querySelector('.js-slider-pin');
      addPin(pin, <Function>valueHandler);
    }
    
    
    
  }

  updateValue(value: number | number[]) {    
    
    const getPxNum = (value: number) => {
      return <number>value / (this._options.maxValue - this._options.minValue) * (this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth)
    }
    console.log('condition!', this._options.range);
    
    if (this._options.range) {
    
      const pxNums = [getPxNum((<number[]>value)[0]), getPxNum((<number[]>value)[1])];
      console.log('VALUES', value);
      
      this._element.querySelector('.js-slider-pin-1 .js-slider-value').textContent = String((<number[]>value)[0]);
      this._element.querySelector('.js-slider-pin-2 .js-slider-value').textContent = String((<number[]>value)[1]);
      console.log('ДВИГАЮ НА', pxNums);
      
      (<HTMLElement>this._element.querySelector('.js-slider-pin-1')).style[this._options.isVertical ? 'bottom' : 'left'] = pxNums[0] + 'px';
      (<HTMLElement>this._element.querySelector('.js-slider-pin-2')).style[this._options.isVertical ? 'bottom' : 'left'] = pxNums[1] + 'px';

    } else {
      const pxNum = getPxNum(<number>value);
      this._element.querySelector('.js-slider-value').textContent = String(value);
      (<HTMLElement>this._element.querySelector('.js-slider-pin')).style[this._options.isVertical ? 'bottom' : 'left'] = pxNum + 'px';
    }
  }

  render(value: number | number[]) {
    if (this._options.range) {
      this._element = render(`
      <div class="slider-plugin js-slider ${this._options.isVertical ? 'slider-plugin--vertical' : ''}">
      <div class="slider-plugin__bar"></div>
      <div class="slider-plugin__pin js-slider-pin js-slider-pin-1">
        <div class="slider-plugin__value ${this._options.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''} js-slider-value">${(<number[]>value)[0]}</div>
      </div>
      <div class="slider-plugin__pin slider-plugin__pin--second js-slider-pin-2">
        <div class="slider-plugin__value ${this._options.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''} js-slider-value">${(<number[]>value)[1]}</div>
      </div>
      <input class="slider-plugin__input js-input" value="${this._options.defaultValue}">
    </div>
      `)

      document.body.appendChild(this._element);
      const firstInitialVal = this._options.defaultValue[0] / (this._options.maxValue - this._options.minValue) * (this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth);
      const secondInitialVal = this._options.defaultValue[1] / (this._options.maxValue - this._options.minValue) * (this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth);
      document.body.removeChild(this._element);

      (<HTMLElement>this._element.querySelector('.js-slider-pin-1')).style[this._options.isVertical ? 'bottom' : 'left'] = firstInitialVal + 'px';
      (<HTMLElement>this._element.querySelector('.js-slider-pin-2')).style[this._options.isVertical ? 'bottom' : 'left'] = secondInitialVal + 'px';
    } else {
      this._element = render(`
      <div class="slider-plugin js-slider ${this._options.isVertical ? 'slider-plugin--vertical' : ''}">
        <div class="slider-plugin__bar"></div>
        <div class="slider-plugin__pin js-slider-pin">
          <div class="slider-plugin__value ${this._options.isTooltipDisabled ? 'slider-plugin__value--hidden' : ''} js-slider-value">${value}</div>
        </div>
        <input type="number" class="slider-plugin__input js-input" value="${this._options.defaultValue}">
      </div>
      `);
      
      // used append-remove trick to calculate element width
      document.body.appendChild(this._element);
      const initialVal = this._options.defaultValue / (this._options.maxValue - this._options.minValue) * (this._options.isVertical ? +this._element.clientHeight : +this._element.clientWidth);
      document.body.removeChild(this._element);
      (<HTMLElement>this._element.querySelector('.js-slider-pin')).style[this._options.isVertical ? 'bottom' : 'left'] = initialVal + 'px';
    }
  }
}
