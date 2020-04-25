import View from './Views/View';
import NewView from './Views/newView';
import Model from './Models/Model';
import Controller from './Controller/Controller';
declare global {
  interface JQuery {
    slider: (options?: object) => JQuery;
    newSlider: (options?: object) => JQuery;
  }
}

const testOptions1 = {
  minValue: -33,
  maxValue: 103,
  step: 2,
  defaultValue: 45,
};

const testOptions2 = {
  minValue: -100,
  maxValue: 100,
  step: 2,
  defaultValue: [-100, 100],
  isVertical: true,
  range: true,
};

const testOptions3 = {
  minValue: -33,
  maxValue: 100,
  step: 2,
  defaultValue: [30, 80],
  range: true,
};
const testOptions4 = {
  minValue: 0,
  maxValue: 100,
  step: 7,
  defaultValue: 45,
  isVertical: true,
};

$.fn.slider = function(options: any): JQuery {
  const model = new Model(options);
  const view = new View(model.getPluginConfig());
  new Controller(model, view);
  $(this).append(view.element);
  view.updateValue(options.defaultValue);
  return this;
};

$('#example-1').slider(testOptions1);
$('#example-2').slider(testOptions2);
$('#example-3').slider(testOptions3);
$('#example-4').slider(testOptions4);

// $('#example-1').newSlider(testOptions1);

$(() => {
  function change(selector: string, val: number) {
    $(`${selector} input` as any).val(String(val));
    $(`${selector} input` as any).change();
  }
  function changeRange(values: number[]) {
    $('#example-2 input' as any).val(String(values.join(' ')));
    $('#example-2 input' as any).change();
  }
  // setTimeout(() => {
  //   change(11);
  //   changeRange([25, 70]);
  // }, 1000);
  // $('#control-1').fo

  //   $('.test')
  //     .find('.control-input')
  //     .change(e => {
  //       console.log($(e.target).val());
  //       console.log(
  //         $(e.target)
  //           .parent()
  //           .find('.example input')
  //           .val(),
  //       );
  //       $(e.target)
  //         .parent()
  //         .children('.example input')
  //         .val($(e.target).val())
  //         .change();
  //       $(e.target)
  //         .parent()
  //         .children('.example input')
  //         .change();

  //     });
});
