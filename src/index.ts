import { identity } from 'identitate';
import type { CreateSelectorOptions } from 'reselect';
import { INVALID_ARRAY_PATHS_MESSAGE, INVALID_PATHS_MESSAGE } from './constants.js';
import type {
  Path,
  ComputeValue,
  IdentitySelector,
  StandardSelector,
  PathStructured,
  ComputeStructuredValue,
  IdentityStructuredSelector,
} from './internalTypes.js';
import {
  getSelectorCreator,
  getStandardSelector,
  getStructuredIdentitySelector,
  getStructuredSelector,
} from './utils.js';

/**
 * Create a selector without any boilerplate code
 *
 * @example
 * import { createSelector } from 'selectorator';
 *
 * interface Item {
 *   name: string;
 *   value: number;
 * }
 *
 * interface State {
 *   items: Item[];
 *   filter: {
 *     value: string;
 *   }
 * }
 *
 * const getFilteredItems = createSelector<State>()(
 *   ['items', 'filter.value'],
 *   (items, filterValue) => items.filter((item) => item.includes(filterValue)),
 * );
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
export function createSelector<Args>(options: CreateSelectorOptions = {}) {
  type Params = Args extends unknown[] ? Args : [Args];

  const selectorCreator = getSelectorCreator(options);

  // When using standard paths
  function selector<const Paths extends [Path<Params>]>(
    paths: Paths,
    getComputedValue?: undefined,
  ): IdentitySelector<Params, Paths>;
  function selector<const Paths extends Array<Path<Params>>, GetComputedValue extends ComputeValue<Params, Paths, any>>(
    paths: Paths,
    getComputedValue: GetComputedValue,
  ): StandardSelector<Params, ReturnType<GetComputedValue>>;
  // When using a structured selector
  function selector<const Paths extends PathStructured<Params>>(
    paths: Paths,
  ): IdentityStructuredSelector<Params, Paths>;
  function selector<
    const Paths extends PathStructured<Params>,
    GetComputedValue extends ComputeStructuredValue<Params, Paths, any>,
  >(paths: Paths, getComputedValue: GetComputedValue): StandardSelector<Params, ReturnType<GetComputedValue>>;
  // implementation
  function selector<const Paths extends Array<Path<Params>>, GetComputedValue extends ComputeValue<Params, Paths, any>>(
    paths: Paths,
    getComputedValue?: GetComputedValue,
  ) {
    if (Array.isArray(paths)) {
      if (!paths.length) {
        throw new ReferenceError(INVALID_ARRAY_PATHS_MESSAGE);
      }

      return getStandardSelector(paths, selectorCreator, getComputedValue ?? identity) as any;
    }

    if (
      typeof paths === 'object'
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      && paths != null
    ) {
      return getStructuredSelector(paths, selectorCreator, getComputedValue ?? getStructuredIdentitySelector(paths));
    }

    throw new TypeError(INVALID_PATHS_MESSAGE);
  }

  return selector;
}
