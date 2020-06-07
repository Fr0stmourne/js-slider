import movePin from './movePin';

describe('movePin()', () => {
  let pin: HTMLElement;
  beforeEach(() => {
    pin = document.createElement('div');
    pin.style.position = 'absolute';
  });
  test('should assign correct styles to the element without passed direction', () => {
    movePin(pin, 50);

    expect(getComputedStyle(pin).left).toEqual('50px');
  });
  test('should assign correct styles to the element in vertical direction', () => {
    movePin(pin, 50, false);

    expect(getComputedStyle(pin).left).toEqual('50px');
  });
  test('should assign correct styles to the element in horizontal direction', () => {
    movePin(pin, 220, true);

    expect(getComputedStyle(pin).bottom).toEqual('220px');
  });
});
