import View from './Views/View';
declare global {
  interface JQuery {
    slider: (options ?:object) => void;
  }
}
$.fn.slider = function (options: object) {
  console.log('test');
  const view = new View();
  $(this).append(view.element)

  return this;
}


$('#root').slider();