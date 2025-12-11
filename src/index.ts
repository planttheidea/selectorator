import { identity } from 'identitate';
import type { CreateSelectorOptions } from 'reselect';
import { INVALID_ARRAY_PATHS_MESSAGE, INVALID_PATHS_MESSAGE } from './constants.js';
import type { Path, ComputeValue, IdentitySelector, StandardSelector } from './internalTypes.js';
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
export function createSelector<Args>(options: CreateSelectorOptions = {}) {
  type Params = Args extends unknown[] ? Args : [Args];

  const selectorCreator = getSelectorCreator(options);

  // When no handler is passed
  function selector<const Paths extends [Path<Params>]>(
    paths: Paths,
    getComputedValue?: undefined,
  ): IdentitySelector<Params, Paths>;
  // When a handler is passed
  function selector<const Paths extends Array<Path<Params>>, GetComputedValue extends ComputeValue<Params, Paths, any>>(
    paths: Paths,
    getComputedValue: GetComputedValue,
  ): StandardSelector<Params, ReturnType<GetComputedValue>>;
  // implementation
  function selector<const Paths extends Array<Path<Params>>, GetComputedValue extends ComputeValue<Params, Paths, any>>(
    paths: Paths,
    getComputedValue = identity as GetComputedValue,
  ) {
    if (Array.isArray(paths)) {
      if (!paths.length) {
        throw new ReferenceError(INVALID_ARRAY_PATHS_MESSAGE);
      }

      return getStandardSelector(paths, selectorCreator, getComputedValue);
    }

    if (
      typeof paths === 'object'
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      && paths != null
    ) {
      return getStructuredSelector(paths, selectorCreator);
    }

    throw new TypeError(INVALID_PATHS_MESSAGE);
  }

  return selector;
}

// interface State {
//   foo: { bar: string };
// }
// interface Props {
//   baz: number;
// }

// const test = createSelector<State>()(['foo.bar'], (value) => ({ value }))({ foo: { bar: 'baz' } });
// const testAny = createSelector<any>()(['foo.bar'], (value) => ({ value }))({ foo: { bar: 'baz' } });
// const testUnknown = createSelector<unknown>()(['foo.bar'], (value) => ({ value }))({ foo: { bar: 'baz' } });
// const testIdentity = createSelector<State>()([['foo', 'bar']])({ foo: { bar: 'baz' } });
// const testPathObject = createSelector<[State, Props]>()(['foo', { argIndex: 1, path: 'baz' }], (foo, baz) => ({
//   foo,
//   baz,
// }))({ foo: { bar: 'baz' } }, { baz: 123 });
// const testCustom = createSelector<State>()(
//   ['foo', (state) => ({ result: state.foo.bar })],
//   (foo, { result }) => `${foo.bar}${result}`,
// )({
//   foo: { bar: 'baz' },
// });
// const testCustomIdentity = createSelector<State>()(['foo', (state) => ({ result: state.foo.bar })])({
//   foo: { bar: 'baz' },
// });
// const testAll = createSelector<[State, Props]>()(
//   ['foo', ['foo', 'bar'], (_, props) => props.baz, { argIndex: 1, path: ['baz'] }],
//   (foo, bar, bazCustom, bazObject) => ({ foo, bar, bazCustom, bazObject }),
// )({ foo: { bar: 'baz' } }, { baz: 123 });
// const testAllIdentity = createSelector<[State, Props]>()([
//   'foo',
//   ['foo', 'bar'],
//   (_, props) => props.baz,
//   { argIndex: 1, path: ['baz'] },
// ])({ foo: { bar: 'baz' } }, { baz: 123 });
