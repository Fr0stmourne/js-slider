import BarView from './BarView';

describe('BarView', () => {
  let bar: BarView;

  beforeEach(() => {
    bar = new BarView();
  });

  test('should store HTML element as .element property', () => {
    expect(bar.element).toBeInstanceOf(HTMLElement);
  });

  test('should call callback on bar mousedown', () => {
    const callback = jest.fn();
    bar.handleBarClick = callback;

    expect(callback).not.toHaveBeenCalled();
    bar.element.dispatchEvent(new Event('mousedown'));
    expect(callback).toHaveBeenCalled();
  });
});
