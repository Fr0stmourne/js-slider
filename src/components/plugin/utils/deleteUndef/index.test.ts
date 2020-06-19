import deleteUndef from '.';

describe('deleteUndef()', () => {
  test('should delete keys with undefined values from object', () => {
    const obj: object = {
      a: 5,
      b: null,
      c: NaN,
      d: undefined,
      test: false,
      aa: 'undefined',
      r: undefined,
    };

    deleteUndef(obj);

    expect(obj).toStrictEqual({
      a: 5,
      b: null,
      c: NaN,
      test: false,
      aa: 'undefined',
    });
  });
});
