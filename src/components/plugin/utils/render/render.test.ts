import render from './render';

describe('render()', () => {
  test('should correctly create DOM structure', () => {
    const markup = `
      <div><p>1</p><p>2</p><p>3</p></div>
    `;

    const wrapper = document.createElement('div');
    for (let i = 0; i < 3; i++) {
      const p = document.createElement('p');
      p.textContent = String(i + 1);
      wrapper.append(p);
    }

    expect(render(markup)).toStrictEqual(wrapper);
  });
});
