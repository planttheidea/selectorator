// external dependencies
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import get from 'lodash/get';
import {
  createSelector as createReselectSelector,
  createSelectorCreator,
  defaultMemoize
} from 'reselect';

/**
 * @private
 *
 * @function throwInvalidPathError
 *
 * @description
 * throw the error that the path type is not a string
 */
export const throwInvalidPathError = () => {
  throw new TypeError('Path must be a string type. It can be dot or bracket notation for nested values, for example: ' +
    '"foo.bar" or "foo[0]".');
};

/**
 * @private
 *
 * @function createIdentitySelector
 *
 * @description
 * based on the path passed, create the identity function for it or return the function itself
 *
 * @param {function|string} path nested path to retrieve from the state object
 * @returns {function} identity function to retrive value from state for given property
 */
export const createIdentitySelector = (path) => {
  if (isFunction(path)) {
    return path;
  }

  if (!isString(path)) {
    throwInvalidPathError();
  }

  return (state) => {
    return get(state, path);
  };
};

/**
 * @private
 *
 * @function getSelectorCreator
 *
 * @description
 * get the creator function to use when generating the selector
 *
 * @param {boolean} [deepEqual=false] should the memoizer be based on strict equality
 * @param {function} [memoizer] function to memoize selectors (coalesces to defaultMemoize if params are provided)
 * @param {Array<*>} [memoizerParams=[]] custom parameters to pass to the memoizer function
 * @returns {function} function to create selector with
 */
export const getSelectorCreator = ({deepEqual = false, memoizer, memoizerParams = []}) => {
  const memoizerFn = memoizer || defaultMemoize;

  if (deepEqual) {
    return createSelectorCreator(memoizerFn, isEqual, ...memoizerParams);
  }

  return memoizerParams.length || isFunction(memoizer) ?
    createSelectorCreator(memoizerFn, ...memoizerParams) :
    createReselectSelector;
};

/**
 * @private
 *
 * @function getStandardSelector
 *
 * @description
 * get a standard selector based on the paths and getComputedValue provided
 *
 * @param {Array<function|string>} paths paths to retrieve values from state from
 * @param {function} selectorCreator function to create selector with
 * @param {function} getComputedValue function to compute values with, receiving properties in state based
 * on paths and returning computed values from them (defaults to pass-through identity function)
 * @returns {function} selector to return computed value from state
 */
export const getStandardSelector = (paths, selectorCreator, getComputedValue) => {
  const selectors = paths.map(createIdentitySelector);

  return selectorCreator(selectors, getComputedValue);
};

/**
 * @private
 *
 * @function getStructuredObject
 *
 * @description
 * get the structured object based on the computed selector values
 *
 * @param {Array<string>} properties properties to assign values from state to
 * @returns {function(...Array<*>): Object} object of property => selected value pairs
 */
export const getStructuredObject = (properties) => {
  return (...values) => {
    return properties.reduce((structuredObject, property, index) => {
      structuredObject[property] = values[index];

      return structuredObject;
    }, {});
  };
};

/**
 * @private
 *
 * @function getStructuredSelector
 *
 * @description
 * get an object of property => selected value pairs bsaed on paths
 *
 * @param {Object} paths property => path pairs, where path is state value to retrieve and assign to property
 * @param {function} selectorCreator function used to create selector
 * @returns {function} selector to return structured values from state
 */
export const getStructuredSelector = (paths, selectorCreator) => {
  const destinationKeys = Object.keys(paths);
  const selectors = destinationKeys.map((key) => {
    return createIdentitySelector(paths[key]);
  });

  return selectorCreator(selectors, getStructuredObject(destinationKeys));
};

/**
 * @private
 *
 * @function throwInvalidPathsError
 *
 * @description
 * throw the error that the paths value is not of the correct type
 */
export const throwInvalidPathsError = () => {
  throw new TypeError('First parameter passed must be either an array or a plain object. If you are creating a ' +
    'standard selector, pass an array of either properties on the state to retrieve, or custom selector functions. ' +
    'If creating a structured selector, pass a plain object with source and destination properties, where source ' +
    'is an array of properties or custom selector functions, and destination is an array of property names to ' +
    'assign the values from source to.');
};

/**
 * @private
 *
 * @function throwNoPathsError
 *
 * @description
 * throw the error that no paths exist
 */
export const throwNoPathsError = () => {
  throw new ReferenceError('You have not provided any values for paths, so no values can be retrieved from state.');
};
