// external dependencies
import * as fe from 'fast-equals';
import * as reselect from 'reselect';

// src
import {
  createIdentitySelector,
  getSelectorCreator,
  getStandardSelector,
  getStructuredObject,
  getStructuredSelector,
} from '../src/utils';

describe('createIdentitySelector', () => {
  it('should create a function that receives state and gets the value at the string path', () => {
    const path: string = 'foo[0].bar[baz]';
    const value: string = 'foo-bar-baz';
    const state: { [key: string]: any[] } = {
      foo: [
        {
          bar: {
            baz: value,
          },
        },
      ],
    };

    const identity: Function = createIdentitySelector(path);

    const result = identity(state);

    expect(result).toBe(value);
  });

  it('should create a function that receives state and gets the value at the array path', () => {
    const path: (string | number)[] = ['foo', 0, 'bar', 'baz'];
    const value: string = 'foo-bar-baz';
    const state: { [key: string]: any[] } = {
      foo: [
        {
          bar: {
            baz: value,
          },
        },
      ],
    };

    const identity: Function = createIdentitySelector(path);

    const result = identity(state);

    expect(result).toBe(value);
  });

  it('should create a function that receives state and gets the value at the number path', () => {
    const path: number = 0;
    const value: string = 'foo-bar-baz';
    const state: { [key: string]: any[] } = {
      foo: [
        {
          bar: {
            baz: value,
          },
        },
      ],
    };

    const identity: Function = createIdentitySelector(path);

    const result = identity(state);

    expect(result).toBe(state[0]);
  });

  it('should create a function that receives state and gets the value at the object path', () => {
    const path: number = 0;
    const value: string = 'foo-bar-baz';
    const state: { [key: string]: any[] } = {
      foo: [
        {
          bar: {
            baz: value,
          },
        },
      ],
    };

    const identity: Function = createIdentitySelector({ argIndex: 1, path });

    const result = identity(state);

    expect(result).toBe(state[0]);
  });

  it('should return the function passed when the path is a function', () => {
    const path: Function = () => {};

    const result: Function = createIdentitySelector(path);

    expect(result).toBe(path);
  });

  it('should throw when path is an object but does not have the argIndex property', () => {
    // @ts-ignore
    expect(() => createIdentitySelector({ path: 'foo' })).toThrow();
  });

  it('should throw when path is an object but does not have the path property', () => {
    // @ts-ignore
    expect(() => createIdentitySelector({ argIndex: 0 })).toThrow();
  });

  it('should throw when path is not valid', () => {
    // @ts-ignore
    expect(() => createIdentitySelector(false)).toThrow();
  });

  it('should throw when path is not passed', () => {
    // @ts-ignore
    expect(() => createIdentitySelector()).toThrow();
  });
});

describe('getSelectorCreator', () => {
  let original: Function;

  beforeEach(() => {
    original = reselect.createSelectorCreator;

    // @ts-ignore
    reselect.createSelectorCreator = jest
      .fn()
      .mockImplementation((arg: any) => arg);
  });

  afterEach(() => {
    // @ts-ignore
    reselect.createSelectorCreator = original;
  });

  it('should return the correct createSelector when passed no options', () => {
    const result = getSelectorCreator({});

    expect(reselect.createSelectorCreator).toHaveBeenCalledTimes(1);
    expect(reselect.createSelectorCreator).toHaveBeenLastCalledWith(
      reselect.defaultMemoize,
      fe.sameValueZeroEqual,
    );

    // @ts-ignore
    reselect.createSelectorCreator.mockReset();

    expect(result).toBe(reselect.defaultMemoize);
  });

  it('should return the correct createSelector when deepEqual is true', () => {
    const result = getSelectorCreator({ deepEqual: true });

    expect(reselect.createSelectorCreator).toHaveBeenCalledTimes(1);
    expect(reselect.createSelectorCreator).toHaveBeenLastCalledWith(
      reselect.defaultMemoize,
      fe.deepEqual,
    );

    // @ts-ignore
    reselect.createSelectorCreator.mockReset();

    expect(result).toBe(reselect.defaultMemoize);
  });

  it('should return the correct createSelector when isEqual is provided', () => {
    const isEqual = () => {};

    const result = getSelectorCreator({ isEqual });

    expect(reselect.createSelectorCreator).toHaveBeenCalledTimes(1);
    expect(reselect.createSelectorCreator).toHaveBeenLastCalledWith(
      reselect.defaultMemoize,
      isEqual,
    );

    // @ts-ignore
    reselect.createSelectorCreator.mockReset();

    expect(result).toBe(reselect.defaultMemoize);
  });

  it('should return the correct createSelector when custom memoizer options are provided', () => {
    const memoizerParams = ['foo'];

    const result = getSelectorCreator({ memoizerParams });

    expect(reselect.createSelectorCreator).toHaveBeenCalledTimes(1);
    expect(reselect.createSelectorCreator).toHaveBeenLastCalledWith(
      reselect.defaultMemoize,
      fe.sameValueZeroEqual,
      ...memoizerParams,
    );

    // @ts-ignore
    reselect.createSelectorCreator.mockReset();

    expect(result).toBe(reselect.defaultMemoize);
  });
});

describe('getStandardSelector', () => {
  it('should create a selector function', () => {
    const path = ['foo.bar'];
    const createSelector = reselect.createSelector;
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
  it('should create an object of key => selector pairs', () => {
    const keys = ['foo', 'bar', 'baz'];
    const generator: Function = getStructuredObject(keys);

    type State = {
      [key: string]: string;
    };

    const state: State = keys.reduce((object: State, key) => {
      object[key] = key;

      return object;
    },                               {});

    const result = generator(state.foo, state.bar, state.baz);

    expect(result).toEqual(state);
  });
});

describe('getStructuredSelector', () => {
  it('should map selectors to specific keys in selector function', () => {
    const paths: { [key: string]: string } = {
      foo: 'bar.baz',
      bar: 'foo',
      baz: 'baz.foo',
    };
    const createSelector = reselect.createSelector;

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
