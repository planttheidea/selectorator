// external dependencies
import { identity } from 'identitate';

// constants
import {
  INVALID_ARRAY_PATHS_MESSAGE,
  INVALID_PATHS_MESSAGE,
} from './constants';

// utils
import {
  getSelectorCreator,
  getStandardSelector,
  getStructuredSelector,
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
 * @param paths paths to retrieve from state as parameters in getComputedValue, or
 * an object of key => path pairs that will assign path at state to key in structured selector
 * @param getComputedValue function that will accept the values at paths in state as parameters
 * and compute the next result
 * @param options additional options available for selector creation
 * @returns selector for state object passed
 */
const createSelector = (
  paths: selectorator.Path[] | PlainObject,
  getComputedValue: Function = identity,
  options: selectorator.Options = {},
): Function => {
  const selectorCreator: Function = getSelectorCreator(options);

  if (Array.isArray(paths)) {
    if (!paths.length) {
      throw new ReferenceError(INVALID_ARRAY_PATHS_MESSAGE);
    }

    return getStandardSelector(paths, selectorCreator, getComputedValue);
  }

  if (paths && typeof paths === 'object') {
    return getStructuredSelector(paths, selectorCreator);
  }

  throw new TypeError(INVALID_PATHS_MESSAGE);
};

export default createSelector;
