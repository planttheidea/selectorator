// external dependencies
import {deepEqual as isDeeplyEqual, sameValueZeroEqual} from 'fast-equals';
import {createIdentity} from 'identitate';
import {createSelectorCreator, defaultMemoize} from 'reselect';
import {get} from 'unchanged';

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @private
 *
 * @function createIdentitySelector
 *
 * @description
 * based on the path passed, create the identity function for it or return the function itself
 *
 * @param {function(Object): *|string} path nested path to retrieve from the state object
 * @returns {function(Object): *} identity function to retrive value from state for given property
 */
export const createIdentitySelector = (path) => {
  const type = typeof path;

  if (type === 'function') {
    return path;
  }

  if (type === 'string' || type === 'number' || Array.isArray(path)) {
    return (state) => {
      return get(path, state);
    };
  }

  if (path && typeof path === 'object') {
    if (!hasOwnProperty.call(path, 'path') || !hasOwnProperty.call(path, 'argIndex')) {
      throw new ReferenceError(
        'When providing an object path, you must provide the following properties:\n' +
          '  * path: the path to retrieve, e.g. "foo.bar."\n' +
          '  * argIndex: the index of the argument to retrieve the path from'
      );
    }

    const selectorIdentity = createIdentity(path.argIndex);

    return function() {
      return get(path.path, selectorIdentity.apply(null, arguments)); // eslint-disable-line prefer-spread
    };
  }

  throw new TypeError(
    'Path provided is of invalid type. It can be any one of the following values:\n' +
      '  * Dot-bracket notation, e.g. "foo.bar" or "bar[0].baz"\n' +
      '  * Number index, e.g. 0\n' +
      '  * Object {path, argIndex}, e.g. {path: "foo.bar", argIndex: 1}\n' +
      '  * Selector function'
  );
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
 * @param {function(*, *): boolean} [isEqual=sameValueZeroEqual] the custom equality method to use when comparing values
 * @param {function(function, function(*, *): boolean, ...Array<*>)} [memoizer=defaultMemoize] custom selector memoizer
 * @param {Array<*>} [memoizerParams=[]] custom parameters to pass to the memoizer function
 * @returns {function} function to create selector with
 */
export const getSelectorCreator = ({
  deepEqual = false,
  isEqual = sameValueZeroEqual,
  memoizer,
  memoizerParams = []
}) => {
  const memoizerFn = memoizer || defaultMemoize;

  return createSelectorCreator(memoizerFn, deepEqual ? isDeeplyEqual : isEqual, ...memoizerParams);
};

/**
 * @private
 *
 * @function getStandardSelector
 *
 * @description
 * get a standard selector based on the paths and getComputedValue provided
 *
 * @param {Array<function(Object): *|string>} paths paths to retrieve values from state from
 * @param {function(Array<function(Object): *>, function): function} selectorCreator function to create selector with
 * @param {function} getComputedValue function to compute values with, receiving properties in state based
 * on paths and returning computed values from them (defaults to pass-through identity function)
 * @returns {function} selector to return computed value from state
 */
export const getStandardSelector = (paths, selectorCreator, getComputedValue) => {
  return selectorCreator(paths.map(createIdentitySelector), getComputedValue);
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
 * @param {function(Array<function(Object): *>, function): function} selectorCreator function to create selector with
 * @returns {function} selector to return structured values from state
 */
export const getStructuredSelector = (paths, selectorCreator) => {
  const destinationKeys = Object.keys(paths);
  const selectors = destinationKeys.map((key) => {
    return createIdentitySelector(paths[key]);
  });

  return selectorCreator(selectors, getStructuredObject(destinationKeys));
};
