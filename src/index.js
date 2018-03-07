// external dependencies
import {identity} from 'identitate';

// utils
import {getSelectorCreator, getStandardSelector, getStructuredSelector} from './utils';

/**
 * @module selectorator
 */

/**
 * @function createSelector
 *
 * @description
 * create a selector without any boilerplate code
 *
 * @example
 * import createSelector from 'selectorator';
 *
 * const getFilteredItems = createSelector(['items', 'filter.value'], (items, filterValue) => {
 *   return items.filter((item) => {
 *     return item.indexOf(filterValue) !== -1;
 *   });
 * });
 *
 * const state = {
 *   items: ['foo', 'bar', 'foo-bar'],
 *   filter: {
 *     value: 'foo'
 *   }
 * };
 *
 * console.log(getFilteredItems(state)); // ['foo', 'foo-bar'];
 * console.log(getFilteredItems(state)); // ['foo', 'foo-bar'], pulled from cache;
 *
 * @param {Array<function|string>|Object} paths paths to retrieve from state as parameters in getComputedValue, or
 * an object of key => path pairs that will assign path at state to key in structured selector
 * @param {function} [getComputedValue=identity] function that will accept the values at paths in state as parameters
 * and compute the next result
 * @param {Object} [options={}] additional options available for selector creation
 * @param {boolean} [options.deepEqual=false] should strict equality be used for memoization
 * @param {function} [options.memoizer=defaultMemoize] custom memoize function for creating selectors with
 * @param {Array<*>} [options.memoizerParams=[]] additional parameters to pass to the selectorCreator function
 * @returns {function} selector for state object passed
 */
const createSelector = (paths, getComputedValue = identity, options = {}) => {
  const selectorCreator = getSelectorCreator(options);

  if (Array.isArray(paths)) {
    if (!paths.length) {
      throw new ReferenceError('You have not provided any values for paths, so no values can be retrieved from state.');
    }

    return getStandardSelector(paths, selectorCreator, getComputedValue);
  }

  if (paths && typeof paths === 'object') {
    return getStructuredSelector(paths, selectorCreator);
  }

  throw new TypeError(
    'First parameter passed must be either an array or a plain object. If you are creating a ' +
      'standard selector, pass an array of either properties on the state to retrieve, or custom selector functions. ' +
      'If creating a structured selector, pass a plain object with source and destination properties, where source ' +
      'is an array of properties or custom selector functions, and destination is an array of property names to ' +
      'assign the values from source to.'
  );
};

export default createSelector;
