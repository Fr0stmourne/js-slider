import render from '.';

describe('render()', () => {
  test('should correctly create DOM structure', () => {
    const markup = `
      <div><p>1</p><p>2</p><p>3</p></div>
    `;

    const wrapper = document.createElement('div');
    [1, 2, 3].forEach(el => {
      const p = document.createElement('p');
      p.textContent = String(el);
      wrapper.append(p);
    });

    expect(render(markup)).toStrictEqual(wrapper);
  });
});
