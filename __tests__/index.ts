// external dependencies
import * as fe from 'fast-equals';
import * as reselect from 'reselect';

// src
import createSelector from '../src';
import * as utils from '../src/utils';

describe('createSelector', () => {
  it('should call getStructuredSelector when paths is an object', () => {
    const spy = jest.spyOn(utils, 'getStructuredSelector');

    createSelector({
      foo: 'bar',
    });

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  it('should throw when paths is not an array nor an object', () => {
    // @ts-ignore
    expect(() => createSelector(false)).toThrow();
  });

  it('should throw when paths is an empty array', () => {
    // @ts-ignore
    expect(() => createSelector([])).toThrow();
  });

  it('should call getSelectorCreator with the options passed', () => {
    const spy = jest.spyOn(utils, 'getSelectorCreator');

    const paths = ['foo'];
    const handler = () => {};
    const options = {
      isEqual: () => false,
    };

    createSelector(paths, handler, options);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(options);

    spy.mockRestore();
  });

  it('should return an identity function when getComputedValue is not provided', () => {
    const spy = jest.spyOn(utils, 'getStandardSelector');

    const selector = createSelector(['foo.bar.baz']);

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();

    const baz = 'baz';

    const result = selector({
      foo: {
        bar: {
          baz,
        },
      },
    });

    expect(result).toBe(baz);
  });

  it('should returns the handler function when getComputedValue is provided', () => {
    const spy = jest.spyOn(utils, 'getStandardSelector');

    const selector = createSelector(
      ['foo.bar.baz'],
      (baz: string) => baz === 'baz',
    );

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();

    const baz = 'baz';

    const result = selector({
      foo: {
        bar: {
          baz,
        },
      },
    });

    expect(result).toBe(true);
  });
});
