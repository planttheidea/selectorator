/* eslint-disable @typescript-eslint/no-empty-function */

import { deepEqual } from 'fast-equals';
import { createSelector, createSelectorCreator, lruMemoize } from 'reselect';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  createIdentitySelector,
  getSelectorCreator,
  getStandardSelector,
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

  test('creates a function that receives state and gets the value at the object path', () => {
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

    const identity = createIdentitySelector({ argIndex: 1, path });

    const result = identity(state);

    expect(result).toBe(state[0]);
  });

  test('returns the function passed when the path is a function', () => {
    const path = () => {};

    const result = createIdentitySelector(path);

    expect(result).toBe(path);
  });

  test('throws when path is an object but does not have the argIndex property', () => {
    expect(() =>
      createIdentitySelector(
        // @ts-expect-error - Testing error condition
        { path: 'foo' },
      ),
    ).toThrow();
  });

  test('throws when path is an object but does not have the path property', () => {
    expect(() =>
      createIdentitySelector(
        // @ts-expect-error - Testing error condition
        { argIndex: 0 },
      ),
    ).toThrow();
  });

  test('throws when path is not valid', () => {
    expect(() =>
      createIdentitySelector(
        // @ts-expect-error - Testing error condition
        false,
      ),
    ).toThrow();
  });

  test('throws when path is not passed', () => {
    expect(() =>
      // @ts-expect-error - Testing error condition
      createIdentitySelector(),
    ).toThrow();
  });
});

describe('getSelectorCreator', () => {
  beforeEach(() => {
    mockCreateSelectorCreator.mockImplementationOnce((arg: any) => arg);
  });

  test('returns the correct createSelector when passed no options', () => {
    const result = getSelectorCreator({});

    expect(mockCreateSelectorCreator).toHaveBeenCalledTimes(1);
    expect(mockCreateSelectorCreator).toHaveBeenLastCalledWith(lruMemoize, Object.is);

    mockCreateSelectorCreator.mockReset();

    expect(result).toBe(lruMemoize);
  });

  test('returns the correct createSelector when deepEqual is true', () => {
    const result = getSelectorCreator({ deepEqual: true });

    expect(mockCreateSelectorCreator).toHaveBeenCalledTimes(1);
    expect(mockCreateSelectorCreator).toHaveBeenLastCalledWith(lruMemoize, deepEqual);

    mockCreateSelectorCreator.mockReset();

    expect(result).toBe(lruMemoize);
  });

  test('returns the correct createSelector when isEqual is provided', () => {
    const isEqual = (a: any, b: any) => a === b;

    const result = getSelectorCreator({ isEqual });

    expect(mockCreateSelectorCreator).toHaveBeenCalledTimes(1);
    expect(mockCreateSelectorCreator).toHaveBeenLastCalledWith(lruMemoize, isEqual);

    mockCreateSelectorCreator.mockReset();

    expect(result).toBe(lruMemoize);
  });

  test('returns the correct createSelector when custom memoizer options are provided', () => {
    const memoizerParams = ['foo'];

    const result = getSelectorCreator({ memoizerParams });

    expect(mockCreateSelectorCreator).toHaveBeenCalledTimes(1);
    expect(mockCreateSelectorCreator).toHaveBeenLastCalledWith(lruMemoize, Object.is, ...memoizerParams);

    mockCreateSelectorCreator.mockReset();

    expect(result).toBe(lruMemoize);
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

    const selector = getStandardSelector(path, createSelector, handler);

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

    const selector = getStructuredSelector(paths, createSelector);

    const result = selector(state);

    expect(result).toEqual({
      foo: state.bar.baz,
      bar: state.foo,
      baz: state.baz.foo,
    });
  });
});
