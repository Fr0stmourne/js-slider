import movePin from '.';

describe('movePin()', () => {
  let pin: HTMLElement;
  beforeEach(() => {
    pin = document.createElement('div');
    pin.style.position = 'absolute';
  });
  test('should assign correct styles to the element without passed direction', () => {
    movePin({ pinElement: pin, value: 50 });

    expect(getComputedStyle(pin).left).toEqual('50px');
  });
  test('should assign correct styles to the element in horizontal direction', () => {
    movePin({ pinElement: pin, value: 50, isVertical: false });

    expect(getComputedStyle(pin).left).toEqual('50px');
  });
  test('should assign correct styles to the element in vertical direction', () => {
    movePin({ pinElement: pin, value: 220, isVertical: true });

    expect(getComputedStyle(pin).bottom).toEqual('220px');
  });
});
