/* eslint-disable @typescript-eslint/no-use-before-define */
import { Options } from 'types';

import ControlPanel from '../../components/ControlPanel';

const testOptions: {
  default: Options;
  vr: Options;
  r: Options;
  v: Options;
} = {
  default: {
    minValue: -33,
    maxValue: 103,
    step: 1,
    value: [72],
    scaleOptionsNum: 9,
    range: false,
  },
  vr: {
    minValue: -112,
    maxValue: 100,
    step: 8,
    value: [-56, 56],
    range: true,
    isVertical: true,
    scaleOptionsNum: 5,
  },
  r: {
    minValue: -33,
    maxValue: 100,
    step: 2,
    value: [29, 79],
    range: true,
    scaleOptionsNum: 5,
  },
  v: {
    minValue: 0,
    maxValue: 100,
    step: 7,
    value: [49],
    range: false,
    isVertical: true,
    scaleOptionsNum: 5,
  },
};

$('.js-example-default').slider(testOptions.default);
$('.js-example-vr').slider(testOptions.vr);
$('.js-example-r').slider(testOptions.r);
$('.js-example-v').slider(testOptions.v);

Object.values(testOptions).forEach((options: Options, index) => {
  const panels = document.querySelectorAll('.js-control-panel');
  new ControlPanel(panels[index] as HTMLElement, options);
});
