// external dependencies
import {deepEqual as isDeeplyEqual} from 'fast-equals';
import {createIdentity} from 'identitate';
import {createSelectorCreator, defaultMemoize} from 'reselect';
import {get} from 'unchanged';

/**
 * @private
 *
 * @function isPlainObject
 *
 * @description
 * is the object passed a plain object
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object a plain object
 */
export const isPlainObject = (object) => {
  return !!object && object.constructor === Object;
};

/**
 * @private
 *
 * @function isSameValueZero
 *
 * @description
 * are the objects passed strictly equal or both NaN
 *
 * @param {*} objectA the object to compare against
 * @param {*} objectB the object to test
 * @returns {boolean} are the objects equal by the SameValueZero principle
 */
export const isSameValueZero = (objectA, objectB) => {
  return objectA === objectB || (objectA !== objectA && objectB !== objectB);
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
  throw new TypeError(
    'First parameter passed must be either an array or a plain object. If you are creating a ' +
      'standard selector, pass an array of either properties on the state to retrieve, or custom selector functions. ' +
      'If creating a structured selector, pass a plain object with source and destination properties, where source ' +
      'is an array of properties or custom selector functions, and destination is an array of property names to ' +
      'assign the values from source to.'
  );
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

/**
 * @private
 *
 * @function throwInvalidPathError
 *
 * @description
 * throw the error that the path type is not a string
 */
export const throwInvalidPathError = () => {
  throw new TypeError(
    'Path must be a string type. It can be dot or bracket notation for nested values, for example: ' +
      '"foo.bar" or "foo[0]".'
  );
};

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

  if (isPlainObject(path)) {
    const selectedIdentity = createIdentity(path.argIndex);

    return function() {
      return get(path.key, selectedIdentity.apply(null, arguments)); // eslint-disable-line prefer-spread
    };
  }

  throwInvalidPathError();
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
 * @param {function(*, *): boolean} [isEqual=isSameValueZero] the custom equality method to use when comparing values
 * @param {function(function, function(*, *): boolean, ...Array<*>)} [memoizer=defaultMemoize] custom selector memoizer
 * @param {Array<*>} [memoizerParams=[]] custom parameters to pass to the memoizer function
 * @returns {function} function to create selector with
 */
export const getSelectorCreator = ({deepEqual = false, isEqual = isSameValueZero, memoizer, memoizerParams = []}) => {
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
