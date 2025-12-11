/* eslint-disable @typescript-eslint/no-empty-function */

import { deepEqual, shallowEqual } from 'fast-equals';
import { createSelector, createSelectorCreator, weakMapMemoize } from 'reselect';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  createIdentitySelector,
  getDeep,
  getSelectorCreator,
  getStandardSelector,
  getStructuredIdentitySelector,
  getStructuredObject,
  getStructuredSelector,
} from '../src/utils.js';

vi.mock('reselect', async () => {
  const actual = await vi.importActual('reselect');

  return {
    ...actual,
    createSelectorCreator: vi.fn(),
  };
});

const mockCreateSelectorCreator = vi.mocked(createSelectorCreator);

describe('createIdentitySelector', () => {
  test('creates a function that receives state and gets the value at the string path', () => {
    const path = 'foo[0].bar[baz]';
    const value = 'foo-bar-baz';
    const state: Record<string, any[]> = {
      foo: [
        {
          bar: {
            baz: value,
          },
        },
      ],
    };

    const identity = createIdentitySelector(path);

    const result = identity(state);

    expect(result).toBe(value);
  });

  test('creates a function that receives state and gets the value at the array path', () => {
    const path = ['foo', 0, 'bar', 'baz'];
    const value = 'foo-bar-baz';
    const state: Record<string, any[]> = {
      foo: [
        {
          bar: {
            baz: value,
          },
        },
      ],
    };

    const identity = createIdentitySelector(path);

    const result = identity(state);

    expect(result).toBe(value);
  });

  test('creates a function that receives state and gets the value at the number path', () => {
    const path = 0;
    const value = 'foo-bar-baz';
    const state: Record<string, any[]> = {
      foo: [
        {
          bar: {
            baz: value,
          },
        },
      ],
    };

    const identity = createIdentitySelector(path);

    const result = identity(state);

    expect(result).toBe(state[0]);
  });

  test('creates a function that receives state and gets the value at the object path at the default arg index', () => {
    const state = {
      foo: [
        {
          bar: {
            baz: 'state value',
          },
        },
      ],
    };
    const props = {
      foo: [
        {
          bar: {
            baz: 'props value',
          },
        },
      ],
    };

    const identity = createIdentitySelector({ path: ['foo', 0, 'bar', 'baz'] });

    const result = identity(state, props);

    expect(result).toBe('state value');
  });

  test('creates a function that receives state and gets the value at the object path when an arg index is provided', () => {
    const state = {
      foo: [
        {
          bar: {
            baz: 'state value',
          },
        },
      ],
    };
    const props = {
      foo: [
        {
          bar: {
            baz: 'props value',
          },
        },
      ],
    };

    const identity = createIdentitySelector({ argIndex: 1, path: ['foo', 0, 'bar', 'baz'] });

    const result = identity(state, props);

    expect(result).toBe('props value');
  });

  test('returns the function passed when the path is a function', () => {
    const path = () => {};

    const result = createIdentitySelector(path);

    expect(result).toBe(path);
  });

  describe('error conditions', () => {
    test('throws when path is an object but does not have the `path` property', () => {
      expect(() =>
        createIdentitySelector(
          // @ts-expect-error - Testing error condition
          { argIndex: 1 },
        ),
      ).toThrow('provide the `path` property');
    });

    test('throws when path is not valid', () => {
      expect(() =>
        createIdentitySelector(
          // @ts-expect-error - Testing error condition
          false,
        ),
      ).toThrow('invalid type');
    });

    test('throws when path is not passed', () => {
      expect(() =>
        // @ts-expect-error - Testing error condition
        createIdentitySelector(),
      ).toThrow('invalid type');
    });
  });
});

describe('getSelectorCreator', () => {
  beforeEach(() => {
    mockCreateSelectorCreator.mockImplementationOnce((arg: any) => arg);
  });

  test('returns the correct createSelector when passed no options', () => {
    const result = getSelectorCreator({});

    expect(mockCreateSelectorCreator).toHaveBeenCalledTimes(1);
    expect(mockCreateSelectorCreator).toHaveBeenLastCalledWith(
      expect.objectContaining({
        memoize: weakMapMemoize,
      }),
    );

    mockCreateSelectorCreator.mockReset();

    expect(result).toEqual({ memoize: weakMapMemoize });
  });

  test('returns the correct createSelector when custom options are applied', () => {
    const result = getSelectorCreator({
      argsMemoizeOptions: { resultEqualityCheck: shallowEqual },
      memoizeOptions: { resultEqualityCheck: deepEqual },
    });

    expect(result).toEqual({
      argsMemoizeOptions: { resultEqualityCheck: shallowEqual },
      memoize: weakMapMemoize,
      memoizeOptions: { resultEqualityCheck: deepEqual },
    });

    expect(mockCreateSelectorCreator).toHaveBeenCalledTimes(1);
    expect(mockCreateSelectorCreator).toHaveBeenLastCalledWith(
      expect.objectContaining({
        argsMemoizeOptions: { resultEqualityCheck: shallowEqual },
        memoizeOptions: { resultEqualityCheck: deepEqual },
      }),
    );

    mockCreateSelectorCreator.mockReset();
  });
});

describe('getStandardSelector', () => {
  test('creates a selector function', () => {
    const path = ['foo.bar'];
    const handler = (bar: string) => !!bar;

    const state = {
      foo: {
        bar: 'baz',
      },
    };

    const selector = getStandardSelector(path, createSelector, handler as any);

    const result = selector(state);

    expect(result).toBe(true);
  });
});

describe('getStructureObject', () => {
  test('creates an object of key => selector pairs', () => {
    const keys = ['foo', 'bar', 'baz'];
    const generator = getStructuredObject(keys);

    const state = keys.reduce<Record<string, string>>((object, key) => {
      object[key] = key;

      return object;
    }, {});

    const result = generator(state.foo, state.bar, state.baz);

    expect(result).toEqual(state);
  });
});

describe('getStructuredSelector', () => {
  test('maps selectors to specific keys in selector function', () => {
    const paths = {
      foo: 'bar.baz',
      bar: 'foo',
      baz: 'baz.foo',
    };

    const state = {
      bar: {
        baz: 'foo',
      },
      baz: {
        foo: 'quz',
      },
      foo: 'bar',
    };

    const selector = getStructuredSelector(paths, createSelector, (foo, bar, quz) => [foo, bar, quz]);
    const result = selector(state);

    expect(result).toEqual(['foo', 'bar', 'quz']);
  });

  test('maps selectors to specific keys in identity function', () => {
    const paths = {
      foo: 'bar.baz',
      bar: 'foo',
      baz: 'baz.foo',
    };

    const state = {
      bar: {
        baz: 'foo',
      },
      baz: {
        foo: 'quz',
      },
      foo: 'bar',
    };

    const selector = getStructuredSelector(paths, createSelector, getStructuredIdentitySelector(paths));
    const result = selector(state);

    expect(result).toEqual({
      foo: state.bar.baz,
      bar: state.foo,
      baz: state.baz.foo,
    });
  });
});

describe('getDeep', () => {
  test('returns `undefined` when no state exists', () => {
    expect(getDeep(['foo'], null)).toBe(undefined);
  });

  test('returns `undefined` when no value exists at the path', () => {
    expect(getDeep(['foo', 'bar', 'baz'], { foo: {} })).toBe(undefined);
  });
});
