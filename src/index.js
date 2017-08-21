// external dependencies
import identity from 'kari/identity';

// utils
import {
  getSelectorCreator,
  getStandardSelector,
  getStructuredSelector,
  isPlainObject,
  throwInvalidPathsError,
  throwNoPathsError
} from './utils';

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

  if (isPlainObject(paths)) {
    return getStructuredSelector(paths, selectorCreator);
  }

  if (!Array.isArray(paths)) {
    throwInvalidPathsError();
  }

  if (!paths.length) {
    throwNoPathsError();
  }

  return getStandardSelector(paths, selectorCreator, getComputedValue);
};

export default createSelector;
