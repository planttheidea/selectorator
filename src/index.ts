import { identity } from 'identitate';
import { INVALID_ARRAY_PATHS_MESSAGE, INVALID_PATHS_MESSAGE } from './constants.js';
import type {
  AnyFn,
  AnyPath,
  AnyPathWithoutObject,
  IdentitySelect,
  Options,
  Select,
  Selector,
  SelectorMultiParam,
} from './internalTypes.js';
import { getSelectorCreator, getStandardSelector, getStructuredSelector, identitySelector } from './utils.js';

function createSelector_NEW<Args>(options: Options = {}) {
  type Params = Args extends unknown[] ? Args : [Args];

  const selectorCreator = getSelectorCreator(options);

  // When no handler is passed
  function selector<const Paths extends Array<AnyPath<Params>>>(
    paths: Paths,
    getComputedValue?: undefined,
  ): IdentitySelect<Params, Paths>;
  // When a handler is passed
  function selector<const Paths extends Array<AnyPath<Params>>, SelectComputedValue extends Select<Params, Paths, any>>(
    paths: Paths,
    getComputedValue: SelectComputedValue,
  ): (...params: Params) => ReturnType<SelectComputedValue>;
  // implementation
  function selector<const Paths extends Array<AnyPath<Params>>, SelectComputedValue extends Select<Params, Paths, any>>(
    paths: Paths,
    getComputedValue = identitySelector as SelectComputedValue,
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

interface State {
  foo: { bar: string };
}
interface Props {
  baz: number;
}

const test = createSelector_NEW<State>()(['foo.bar'], (value) => ({ value }))({ foo: { bar: 'baz' } });
const testAny = createSelector_NEW<any>()(['foo.bar'], (value) => ({ value }))({ foo: { bar: 'baz' } });
const testUnknown = createSelector_NEW<unknown>()(['foo.bar'], (value) => ({ value }))({ foo: { bar: 'baz' } });
const testIdentity = createSelector_NEW<State>()([['foo', 'bar']])({ foo: { bar: 'baz' } });
const testPathObject = createSelector_NEW<[State, Props]>()(['foo', { argIndex: 1, path: 'baz' }], (foo, baz) => ({
  foo,
  baz,
}))({ foo: { bar: 'baz' } }, { baz: 123 });
const testCustom = createSelector_NEW<State>()(
  ['foo', (state) => ({ result: state.foo.bar })],
  (foo, { result }) => `${foo.bar}${result}`,
)({
  foo: { bar: 'baz' },
});
const testCustomIdentity = createSelector_NEW<State>()(['foo', (state) => ({ result: state.foo.bar })])({
  foo: { bar: 'baz' },
});
const testAll = createSelector_NEW<[State, Props]>()(
  ['foo', ['foo', 'bar'], (_, props) => props.baz, { argIndex: 1, path: ['baz'] }],
  (foo, bar, bazCustom, bazObject) => ({ foo, bar, bazCustom, bazObject }),
)({ foo: { bar: 'baz' } }, { baz: 123 });
const testAllIdentity = createSelector_NEW<[State, Props]>()([
  'foo',
  ['foo', 'bar'],
  (_, props) => props.baz,
  { argIndex: 1, path: ['baz'] },
])({ foo: { bar: 'baz' } }, { baz: 123 });

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
// actual implementation - no changes
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
