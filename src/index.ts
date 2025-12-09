// external dependencies
import { identity } from 'identitate';
import type { AnyFn } from 'moize';
import { INVALID_ARRAY_PATHS_MESSAGE, INVALID_PATHS_MESSAGE } from './constants.js';
import type { AnyPath, Options, PathObject, Selector, SelectorMultiParam } from './internalTypes.js';
import { getSelectorCreator, getStandardSelector, getStructuredSelector } from './utils.js';

/**
 * Create a selector without any boilerplate code
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
 */
// when path is empty
export function createSelector<Path extends never>(paths: Path[]): never;
// overload for getIdentity - multiParam
export function createSelector<Path extends PathObject, State extends any[], Output = any>(
  paths: Path[],
): SelectorMultiParam<State, Output>;
// overload for getIdentity
export function createSelector<Path extends AnyPath, State, Output = any>(paths: Path[]): Selector<State, Output>;
export function createSelector<Path extends object, State, Output extends Record<string, AnyFn>>( // overload for structured
  paths: Path, // selectors
): Selector<
  State,
  {
    [Key in keyof Output]: Output[Key] extends (...args: any[]) => infer Return ? Return : any;
  }
>;
// overload for selectors with path objects
export function createSelector<
  Path extends PathObject,
  State extends any[],
  Output extends object,
  GetComputedValue extends (...args: any[]) => Output,
>(
  paths: Path[], // for multiple parameters.
  getComputedValue: GetComputedValue,
): SelectorMultiParam<State, Output>;
// overload for standard selector
export function createSelector<
  Path extends AnyPath,
  State,
  Output,
  GetComputedValue extends (...args: any[]) => Output,
>(paths: Path[], getComputedValue: GetComputedValue): Selector<State, Output>;
// actual implementation - no changesE
export function createSelector<
  Path extends AnyPath,
  State,
  Output,
  GetComputedValue extends (...args: any[]) => Output,
>(
  paths: Path,
  getComputedValue: GetComputedValue = identity as GetComputedValue,
  options: Options = {},
): Selector<State, Output> {
  const selectorCreator = getSelectorCreator(options);

  if (Array.isArray(paths)) {
    if (!paths.length) {
      throw new ReferenceError(INVALID_ARRAY_PATHS_MESSAGE);
    }

    return getStandardSelector(paths, selectorCreator, getComputedValue) as any;
  }
  // added null check
  if (paths && typeof paths === 'object') {
    return getStructuredSelector(paths, selectorCreator) as any;
  }

  throw new TypeError(INVALID_PATHS_MESSAGE);
}
