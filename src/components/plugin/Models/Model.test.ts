// import { Options } from '../types';
// import Model from './Model';

// const testOptions: { normal: Options; range: Options } = {
//   normal: {
//     minValue: -30,
//     maxValue: 100,
//     step: 5,
//     defaultValue: 45,
//   },

//   range: {
//     minValue: 0,
//     maxValue: 100,
//     step: 2,
//     defaultValue: [6, 64],
//   },
// };

// let defaultModel: Model;
// let rangeModel: Model;

// describe('Value setter', () => {
//   beforeAll(() => {
//     defaultModel = new Model(testOptions.normal);
//     rangeModel = new Model(testOptions.range);
//   });
//   test('should correctly update model value', () => {
//     defaultModel.value = 50;
//     expect(defaultModel.value).toBe(50);

//     defaultModel.value = 20;
//     expect(defaultModel.value).toBe(20);
//   });

//   test('should correctly update model value: range', () => {
//     rangeModel.value = [50, 70];
//     expect(rangeModel.value).toEqual([50, 70]);

//     rangeModel.value = [0, 100];
//     expect(rangeModel.value).toEqual([0, 100]);
//   });

//   test('should replace newValue with a min/max value if newValue is not in the interval', () => {
//     defaultModel.value = 1000;
//     expect(defaultModel.value).toEqual(100);

//     defaultModel.value = -70;
//     expect(defaultModel.value).toEqual(-30);
//   });

//   test('should replace newValue with a min/max value if newValue is not in the interval: range', () => {
//     rangeModel.value = [-90, 70];
//     expect(rangeModel.value).toEqual([0, 70]);

//     rangeModel.value = [0, 200];
//     expect(rangeModel.value).toEqual([0, 100]);
//   });

//   test('should ceil the values if they are not multiples of the step value', () => {
//     defaultModel.value = 51;
//     expect(defaultModel.value).toEqual(55);

//     rangeModel.value = [31, 77];
//     expect(rangeModel.value).toEqual([32, 78]);
//   });

//   test('should swap min/max values if min value > max value', () => {
//     rangeModel.value = [70, 30];
//     expect(rangeModel.value).toEqual([30, 70]);
//     rangeModel.value = [63, -30];
//     expect(rangeModel.value).toEqual([0, 64]);
//   });
// });

// describe('getPluginConfig()', () => {
//   beforeAll(() => {
//     defaultModel = new Model(testOptions.normal);
//     rangeModel = new Model(testOptions.range);
//   });

//   test('should return options object', () => {
//     expect(defaultModel.getPluginConfig()).toEqual(testOptions.normal);
//     expect(rangeModel.getPluginConfig()).toEqual(testOptions.range);
//   });
// });

// describe('bindSetValue()', () => {
//   beforeAll(() => {
//     defaultModel = new Model(testOptions.normal);
//     rangeModel = new Model(testOptions.range);
//   });

//   test('should store the passed function in the class property', () => {
//     function testHandler(): void {
//       console.log(123);
//     }

//     defaultModel.bindSetValue(testHandler);
//     expect(defaultModel._onValueChange).toEqual(testHandler);

//     rangeModel.bindSetValue(testHandler);
//     expect(rangeModel._onValueChange).toEqual(testHandler);
//   });
// });
