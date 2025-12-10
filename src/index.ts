import { identity } from 'identitate';
import { INVALID_ARRAY_PATHS_MESSAGE, INVALID_PATHS_MESSAGE } from './constants.js';
import type { AnyFn, AnyPath, AnyPathWithoutObject, Options, Selector, SelectorMultiParam } from './internalTypes.js';
import { getSelectorCreator, getStandardSelector, getStructuredSelector } from './utils.js';

function createTest<State>() {
  return <const Path, Fn extends (value: Path extends keyof State ? State[Path] : undefined) => any>(
    path: Path,
    handler: Fn,
  ) => {
    return (state: State): ReturnType<Fn> => {
      return handler(state[path]);
    };
  };
}

const test = createTest<{ foo: string }>()('foo', (value) => [value])({ foo: 'baz' });

/**
 *
 *
 *
 *
 *
 *
 *
 * MAKE THIS PARTIAL APPLICATION FOR BEST TYPING
 *
 * const selector = createSelector<State>()(['path.to.thing', 'other.path']);
 * const selector = createSelector<State>()(['path.to.thing', 'other.path'], (thing, path) => [thing, path]);
 * const selector = createSelector<State>(options)(['path.to.thing', 'other.path']);
 * const selector = createSelector<State>(options)(['path.to.thing', 'other.path'], (thing, path) => [thing, path]);
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

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
export function createSelector<Path extends AnyPathWithoutObject, State, Output>(
  paths: Path[],
): Selector<State, Output>;
// overload for getIdentity
export function createSelector<Path extends AnyPath, State extends any[], Output>(
  paths: Path[],
): SelectorMultiParam<State, Output>;
// overload for structured
export function createSelector<Path extends object, State, Output extends Record<string, AnyFn>>(
  paths: Path, // selectors
): Selector<
  State,
  {
    [Key in keyof Output]: Output[Key] extends (...args: any[]) => infer Return ? Return : any;
  }
>;
// overload for standard selector
export function createSelector<
  Path extends AnyPathWithoutObject,
  State,
  _Output,
  GetComputedValue extends (state: State) => any,
>(paths: Path[], getComputedValue: GetComputedValue, options?: Options): Selector<State, ReturnType<GetComputedValue>>;
export function createSelector<
  Path extends AnyPath,
  State extends any[],
  _Output,
  GetComputedValue extends (...state: State) => any,
>(
  paths: Path[],
  getComputedValue: GetComputedValue,
  options?: Options,
): SelectorMultiParam<State, ReturnType<GetComputedValue>>;
// actual implementation - no changesE
export function createSelector<Path extends AnyPath, _State, _Output, GetComputedValue extends (...args: any[]) => any>(
  paths: Path[],
  getComputedValue: GetComputedValue = identity as GetComputedValue,
  options: Options = {},
) {
  const selectorCreator = getSelectorCreator(options);

  if (Array.isArray(paths)) {
    if (!paths.length) {
      throw new ReferenceError(INVALID_ARRAY_PATHS_MESSAGE);
    }

    return getStandardSelector(paths, selectorCreator, getComputedValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (paths && typeof paths === 'object') {
    return getStructuredSelector(paths, selectorCreator);
  }

  throw new TypeError(INVALID_PATHS_MESSAGE);
}
