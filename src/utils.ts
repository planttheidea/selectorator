// external dependencies
import { deepEqual as isDeeplyEqual } from 'fast-equals';
import { createIdentity } from 'identitate';
import { createSelectorCreator, lruMemoize } from 'reselect';
import { get } from 'unchanged';
import { INVALID_OBJECT_PATH_MESSAGE, INVALID_PATH_MESSAGE } from './constants.js';
import type { AnyFn, AnyPath, Options, PathObject, UnchangedPath } from './internalTypes.js';

// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * is the path a functions
 */
export function isFunctionPath(path: AnyPath): path is AnyFn {
  return typeof path === 'function';
}

/**
 * is the path an object
 */
export function isObjectPath(path: AnyPath): path is PathObject {
  return !!path && typeof path === 'object';
}

/**
 * is the path an unchanged path value
 */
export function isUnchangedPath(path: AnyPath, nested?: boolean): path is UnchangedPath {
  const type = typeof path;

  return (
    type === 'string'
    || type === 'number'
    || (!nested && Array.isArray(path) && path.every((item) => isUnchangedPath(item, true)))
  );
}

/**
 * based on the path passed, create the identity function for it or return the function itself
 */
export function createIdentitySelector(path: AnyPath): AnyFn {
  if (isFunctionPath(path)) {
    return path;
  }

  if (isUnchangedPath(path)) {
    return <State>(state: State) =>
      get(
        // @ts-expect-error - Types from `unchanged` are still kind of weak
        path,
        state,
      );
  }

  if (isObjectPath(path)) {
    if (hasOwnProperty.call(path, 'path') && hasOwnProperty.call(path, 'argIndex')) {
      const selectorIdentity = createIdentity(path.argIndex);

      return function (...args: any[]) {
        return get(path.path, selectorIdentity(...args));
      };
    }

    throw new ReferenceError(INVALID_OBJECT_PATH_MESSAGE);
  }

  throw new TypeError(INVALID_PATH_MESSAGE);
}

/**
 * get the creator function to use when generating the selector
 */
export function getSelectorCreator({
  deepEqual = false,
  isEqual = Object.is,
  memoizer,
  memoizerParams = [],
}: Options): AnyFn {
  const memoizerFn: AnyFn = memoizer ?? lruMemoize;
  const equals: AnyFn = deepEqual ? isDeeplyEqual : isEqual;

  return createSelectorCreator(memoizerFn, equals, ...memoizerParams);
}

/**
 * get a standard selector based on the paths and getComputedValue provided
 */
export function getStandardSelector(paths: AnyPath[], selectorCreator: AnyFn, getComputedValue: AnyFn): AnyFn {
  return selectorCreator(paths.map(createIdentitySelector), getComputedValue);
}

/**
 * get the structured object based on the computed selector values
 */
export function getStructuredObject(properties: string[]): AnyFn {
  return function structuredObject(...values: any[]) {
    return properties.reduce<Record<string, any>>((structuredObject, property, index) => {
      structuredObject[property] = values[index];

      return structuredObject;
    }, {});
  };
}
/**
 * get an object of property => selected value pairs bsaed on paths
 */
export function getStructuredSelector(paths: Record<string, any>, selectorCreator: AnyFn): AnyFn {
  const destinationKeys = Object.keys(paths);
  const selectors = destinationKeys.map((key) => createIdentitySelector(paths[key]));

  return selectorCreator(selectors, getStructuredObject(destinationKeys));
}
