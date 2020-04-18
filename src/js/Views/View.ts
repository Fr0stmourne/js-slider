function render (markup: string) : DocumentFragment {
  const wrapper = document.createElement('template');
  wrapper.innerHTML = markup.trim();
  return wrapper.content;
}

export default class View {
  _element: DocumentFragment;
  handler: Function;
  options: any;


  constructor(config: any) {
    this.options = config;
    this._element = this.render();
  }

  get element() {
    return this._element;
  }

  // get element() {
  //   if (this._element) {
  //     return this._element;
  //   }

  //   this._element = this.render();
  //   this.bind(this._element);
  //   return this._element;
  // }

  bindMovePin(handler?: Function) {    
    const pin: HTMLElement = this._element.querySelector('.js-slider-pin');
    const slider: HTMLElement = this._element.querySelector('.js-slider');

    pin.onmousedown = (event) => {
      event.preventDefault();

      let shiftX = event.clientX - pin.getBoundingClientRect().left;

      const onMouseMove = (e: MouseEvent) => {
        let newLeft = e.clientX - shiftX - slider.getBoundingClientRect().left;
  
        // курсор вышел из слайдера => оставить бегунок в его границах.
        if (newLeft < 0) {
          newLeft = 0;
        }
        let rightEdge = slider.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
        
        const width = slider.clientWidth;
        console.log(newLeft, rightEdge, width, e);
        // console.log('width', slider.clientWidth);
        
        const percentage = ((newLeft + 1) / width).toFixed(2);
        console.log(percentage);

        if (handler) handler(percentage);
        // console.log(e);
        
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

  // bind(_element: DocumentFragment) {
  //   const pin: HTMLElement = _element.querySelector('.js-slider-pin');
  //   const slider: HTMLElement = _element.querySelector('.js-slider');

  //   // const handler = this.handleChange;
  //   // const options = this.options;

  //   pin.onmousedown = function(event) {
  //     event.preventDefault(); // предотвратить запуск выделения (действие браузера)

  //     let shiftX = event.clientX - pin.getBoundingClientRect().left;
  //     // shiftY здесь не нужен, слайдер двигается только по горизонтали

  //     document.addEventListener('mousemove', onMouseMove);
  //     document.addEventListener('mouseup', onMouseUp);

  //     function onMouseMove(e: MouseEvent) {
  //       let newLeft = e.clientX - shiftX - slider.getBoundingClientRect().left;

  //       // курсор вышел из слайдера => оставить бегунок в его границах.
  //       if (newLeft < 0) {
  //         newLeft = 0;
  //       }
  //       let rightEdge = slider.offsetWidth - pin.offsetWidth;
  //       if (newLeft > rightEdge) {
  //         newLeft = rightEdge;
  //       }

  //       pin.style.left = newLeft + 'px';
  //       // console.log(options);
        
        
       
        
  //     }

  //     function onMouseUp() {
  //       document.removeEventListener('mouseup', onMouseUp);
  //       document.removeEventListener('mousemove', onMouseMove);
  //     }

  //   };

  //   pin.ondragstart = function() {
  //     return false;
  //   }
    
  // }

  render() {
    return render(`
    <div class="slider-plugin js-slider">
      <div class="slider-plugin__bar"></div>
      <div class="slider-plugin__pin js-slider-pin">
        <div class="slider-plugin__value">${this.options._value}</div>
      </div>
    </div>
    `)
  }
}
