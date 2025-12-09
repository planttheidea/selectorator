import { Path, PathItem } from 'pathington';

type AnyFn = (...args: any[]) => any;
interface PathObject {
  argIndex: number;
  path: UnchangedPath | UnchangedPath[];
}
type UnchangedPath = number | string;
type AnyPath = Selector<any, any> | Path | PathItem | PathObject;
interface Options {
  deepEqual?: boolean;
  isEqual?: <Value>(a: Value, b: Value) => boolean;
  memoizer?: AnyFn;
  memoizerParams?: any[];
}
type Selector<State, Output> = (state: State) => Output;
type SelectorMultiParam<State extends unknown[], Output> = (...state: State) => Output;

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
declare function createSelector<Path extends never>(paths: Path[]): never;
declare function createSelector<Path extends AnyPath, State, Output>(paths: Path[]): Selector<State, Output>;
declare function createSelector<Path extends PathObject, State extends any[], Output>(
  paths: Path[],
): SelectorMultiParam<State, Output>;
declare function createSelector<Path extends object, State, Output extends Record<string, AnyFn>>(
  paths: Path,
): Selector<
  State,
  {
    [Key in keyof Output]: Output[Key] extends (...args: any[]) => infer Return ? Return : any;
  }
>;
declare function createSelector<
  Path extends AnyPath,
  State extends any[],
  _Output,
  GetComputedValue extends (...state: State) => any,
>(
  paths: Path[],
  getComputedValue: GetComputedValue,
  options?: Options,
): SelectorMultiParam<State, ReturnType<GetComputedValue>>;

export { createSelector };
