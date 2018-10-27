// external dependencies
import { deepEqual as isDeeplyEqual, sameValueZeroEqual } from 'fast-equals';
import { createIdentity } from 'identitate';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { get } from 'unchanged';

// constants
import { INVALID_OBJECT_PATH_MESSAGE, INVALID_PATH_MESSAGE } from './constants';

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @private
 *
 * @function isFunctionPath
 *
 * @description
 * is the path a function
 *
 * @param path the path to test
 * @param type the typeof value for the path
 * @returns is the path a function
 */
export const isFunctionPath = (
  path: selectorator.Path,
  type: string,
): path is Function => type === 'function';

/**
 * @private
 *
 * @function isObjectPath
 *
 * @description
 * is the path an object
 *
 * @param path the path to test
 * @param type the typeof value for the path
 * @returns is the path an object
 */
export const isObjectPath = (
  path: selectorator.Path,
  type: string,
): path is selectorator.PathObject => !!path && type === 'object';

/**
 * @private
 *
 * @function isUnchangedPath
 *
 * @description
 * is the path an unchanged path value
 *
 * @param path the path to test
 * @param type the typeof value for the path
 * @returns is the path an unchanged path value
 */
export const isUnchangedPath = (
  path: selectorator.Path,
  type: string,
): path is string | number | (string | number)[] =>
  type === 'string' || type === 'number' || Array.isArray(path);

/**
 * @private
 *
 * @function createIdentitySelector
 *
 * @description
 * based on the path passed, create the identity function for it or return the function itself
 *
 * @param path nested path to retrieve from the state object
 * @returns identity function to retrieve value from state for given property
 */
export const createIdentitySelector = (path: selectorator.Path): Function => {
  const type: string = typeof path;

  if (isFunctionPath(path, type)) {
    return path;
  }

  if (isUnchangedPath(path, type)) {
    return (state: PlainObject): any => get(path, state);
  }

  if (isObjectPath(path, type)) {
    if (
      hasOwnProperty.call(path, 'path') &&
      hasOwnProperty.call(path, 'argIndex')
    ) {
      const selectorIdentity: Function = createIdentity(path.argIndex);

      return function () {
        return get(path.path, selectorIdentity.apply(null, arguments));
      };
    }

    throw new ReferenceError(INVALID_OBJECT_PATH_MESSAGE);
  }

  throw new TypeError(INVALID_PATH_MESSAGE);
};

/**
 * @private
 *
 * @function getSelectorCreator
 *
 * @description
 * get the creator function to use when generating the selector
 *
 * @param deepEqual should the memoizer be based on strict equality
 * @param isEqual the custom equality method to use when comparing values
 * @param memoizer custom selector memoizer
 * @param memoizerParams custom parameters to pass to the memoizer function
 * @returns function to create selector with
 */
export const getSelectorCreator = ({
  deepEqual = false,
  isEqual = sameValueZeroEqual,
  memoizer,
  memoizerParams = [],
}: selectorator.Options): Function => {
  const memoizerFn: Function = memoizer || defaultMemoize;
  const equals: Function = deepEqual ? isDeeplyEqual : isEqual;

  return createSelectorCreator.call(
    null,
    memoizerFn,
    equals,
    ...memoizerParams,
  );
};

/**
 * @private
 *
 * @function getStandardSelector
 *
 * @description
 * get a standard selector based on the paths and getComputedValue provided
 *
 * @param paths paths to retrieve values from state from
 * @param selectorCreator function to create selector with
 * @param getComputedValue function to compute values with, receiving properties in state based
 *   on paths and returning computed values from them (defaults to pass-through identity function)
 * @returns selector to return computed value from state
 */
export const getStandardSelector = (
  paths: selectorator.Path[],
  selectorCreator: Function,
  getComputedValue: Function,
): Function =>
  selectorCreator(paths.map(createIdentitySelector), getComputedValue);

/**
 * @private
 *
 * @function getStructuredObject
 *
 * @description
 * get the structured object based on the computed selector values
 *
 * @param properties properties to assign values from state to
 * @returns object of property => selected value pairs
 */
export const getStructuredObject = (properties: string[]): Function => (
  ...values: any[]
) =>
  properties.reduce(
    (
      structuredObject: PlainObject,
      property: string,
      index: number,
    ): PlainObject => {
      structuredObject[property] = values[index];

      return structuredObject;
    },
    {},
  );

/**
 * @private
 *
 * @function getStructuredSelector
 *
 * @description
 * get an object of property => selected value pairs bsaed on paths
 *
 * @param paths property => path pairs, where path is state value to retrieve and assign to property
 * @param selectorCreator function to create selector with
 * @returns selector to return structured values from state
 */
export const getStructuredSelector = (
  paths: PlainObject,
  selectorCreator: Function,
): Function => {
  const destinationKeys: string[] = Object.keys(paths);
  const selectors: Function[] = destinationKeys.map(
    (key: string): Function => createIdentitySelector(paths[key]),
  );

  return selectorCreator(selectors, getStructuredObject(destinationKeys));
};
