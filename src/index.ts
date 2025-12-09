// external dependencies
import { identity } from 'identitate';

// constants
import { INVALID_ARRAY_PATHS_MESSAGE, INVALID_PATHS_MESSAGE } from './constants';

// utils
import { getSelectorCreator, getStandardSelector, getStructuredSelector } from './utils';

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

function createSelector<State extends never, Output extends never>( // overload to signify errors
  paths: never[], // when path is empty
): never;

function createSelector<State, Output = any>( // overload for getIdentity
  paths: selectorator.PathWithoutObject[],
): selectorator.Selector<State, Output>;

function createSelector<State extends any[], Output = any>( // overload for getIdentity - multiParam
  paths: selectorator.Path[],
): selectorator.SelectorMultiParam<State, Output>;

function createSelector<State, Output extends PlainObject = PlainObject>( // overload for structured
  paths: Output, // selectors
): selectorator.Selector<
  State,
  {
    [key in keyof Output]: Output[key] extends (...args: any[]) => infer Return ? Return : any;
  }
>;

function createSelector<State, Output>( // overload for standard selector
  paths: selectorator.PathWithoutObject[],
  getComputedValue: (...args: any) => Output,
  options?: selectorator.Options,
): selectorator.Selector<State, Output>;

function createSelector<State extends any[], Output>( // overload for selectors with path objects
  paths: selectorator.Path[], // for multiple parameters.
  getComputedValue: (...args: any) => Output,
  options?: selectorator.Options,
): selectorator.SelectorMultiParam<State, Output>;

function createSelector<State, Output>( // actual implementation - no changes
  paths: selectorator.Path[] | PlainObject,
  getComputedValue: (...args: any) => Output = identity,
  options: selectorator.Options = {},
): selectorator.Selector<State, Output> {
  const selectorCreator: Function = getSelectorCreator(options);

  if (Array.isArray(paths)) {
    if (!paths.length) {
      throw new ReferenceError(INVALID_ARRAY_PATHS_MESSAGE);
    }

    return <any>getStandardSelector(paths, selectorCreator, getComputedValue);
  }
  // added null check
  if (paths && paths !== null && typeof paths === 'object') {
    return <any>getStructuredSelector(paths, selectorCreator);
  }

  throw new TypeError(INVALID_PATHS_MESSAGE);
}

export default createSelector;
