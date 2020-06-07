import BarView from './BarView';

describe('BarView', () => {
  let bar: BarView;

  beforeEach(() => {
    bar = new BarView();
  });

  test('should store HTML element as .element property', () => {
    expect(bar.element).toBeInstanceOf(HTMLElement);
  });
});
