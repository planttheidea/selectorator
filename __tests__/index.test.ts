/* eslint-disable @typescript-eslint/no-empty-function */

import { memoize } from 'micro-memoize';
import { describe, expect, test, vi } from 'vitest';
import { createSelector } from '../src/index.js';
import * as utils from '../src/utils.js';

describe('createSelector', () => {
  test('calls getStructuredSelector when paths is an object', () => {
    const spy = vi.spyOn(utils, 'getStructuredSelector');

    interface State {
      foo: string;
    }

    createSelector<State>()({ foo: 'bar' });

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  test('throws when paths is not an array nor an object', () => {
    expect(() =>
      createSelector()(
        // @ts-expect-error - Testing error condition
        false,
      ),
    ).toThrow();
  });

  test('throws when paths is an empty array', () => {
    expect(() =>
      createSelector()(
        // @ts-expect-error - Testing error condition
        [],
      ),
    ).toThrow();
  });

  test('calls getSelectorCreator with the options passed', () => {
    const spy = vi.spyOn(utils, 'getSelectorCreator');

    const paths = ['foo'];
    const handler = () => {};
    const options = { memoize };

    createSelector(options)(paths, handler);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(options);

    spy.mockRestore();
  });

  test('returns an identity function when getComputedValue is not provided', () => {
    const spy = vi.spyOn(utils, 'getStandardSelector');

    interface State {
      foo: {
        bar: {
          baz: string;
        };
      };
    }

    const selector = createSelector<State>()(['foo.bar.baz']);

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();

    const result = selector({
      foo: {
        bar: { baz: 'baz' },
      },
    });

    expect(result).toBe('baz');
  });

  test('returns the handler function when getComputedValue is provided', () => {
    const spy = vi.spyOn(utils, 'getStandardSelector');

    interface State {
      foo: {
        bar: {
          baz: string;
        };
      };
    }

    const selector = createSelector<State>()(['foo.bar.baz'], (baz: string) => baz === 'baz');

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();

    const result = selector({
      foo: {
        bar: { baz: 'baz' },
      },
    });

    expect(result).toBe(true);
  });
});
