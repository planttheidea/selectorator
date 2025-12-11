import { DefaultMemoizeFields, CreateSelectorOptions } from 'reselect';
import { Path as Path$1, PathItem, ParsePath } from 'pathington';

interface PathObject {
  argIndex?: number;
  path: PathingtonPath;
}
type PathingtonPath = Path$1 | PathItem;
type Path<Params extends unknown[]> = ManualSelectInput<Params> | PathingtonPath | PathObject;
type PathStructured<Params extends unknown[]> = Record<string, Path<Params>>;
type IsNull<T> = [T] extends [null] ? true : false;
type IsUnknown<T> = unknown extends T ? (IsNull<T> extends false ? true : false) : false;
type PickArray<Value extends unknown[], Index extends number> = Value[Index];
type PickObject<Value extends object, Key extends keyof Value> = Value[Key];
type WidenUnknown<T extends unknown[], Result extends any[] = []> = T extends [infer Head, ...infer Tail]
  ? IsUnknown<Head> extends true
    ? WidenUnknown<Tail, [...Result, any]>
    : WidenUnknown<Tail, [...Result, Head]>
  : Result;
type PickDeepInternal<Value, Property extends unknown[]> =
  IsUnknown<Value> extends true
    ? unknown
    : Property extends [infer Next, ...infer Rest]
      ? Value extends object
        ? Next extends keyof Value
          ? PickDeepInternal<PickObject<Value, Next>, Rest>
          : undefined
        : Value extends unknown[]
          ? Next extends number
            ? PickDeepInternal<PickArray<Value, Next>, Rest>
            : undefined
          : undefined
      : Value;
type PickDeepInternalNormalized<Value, Property> = Property extends unknown[]
  ? PickDeepInternal<Value, Property>
  : Property extends readonly unknown[]
    ? PickDeepInternal<Value, [...Property]>
    : any;
type PickDeep<Params, Property extends PathingtonPath> = PickDeepInternalNormalized<Params, ParsePath<Property>>;
type ManualSelectInput<Params extends unknown[]> = (...params: WidenUnknown<Params>) => any;
type SelectInputs<Params extends unknown[], Paths extends unknown[], Values extends unknown[] = []> = Paths extends [
  infer Property,
  ...infer Remaining,
]
  ? Property extends PathingtonPath
    ? SelectInputs<Params, Remaining, [...Values, PickDeep<Params[0], Property>]>
    : Property extends PathObject
      ? Property['argIndex'] extends number
        ? SelectInputs<Params, Remaining, [...Values, PickDeep<Params[Property['argIndex']], Property['path']>]>
        : SelectInputs<Params, Remaining, [...Values, PickDeep<Params[0], Property['path']>]>
      : Property extends ManualSelectInput<Params>
        ? SelectInputs<Params, Remaining, [...Values, ReturnType<Property>]>
        : SelectInputs<Params, Remaining, [...Values, never]>
  : Values;
type UnionToIntersection<Union> = (Union extends unknown ? (distributedUnion: Union) => void : never) extends (
  mergedIntersection: infer Intersection,
) => void
  ? Intersection & Union
  : never;
type Push<T extends any[], V> = [...T, V];
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : Push<TuplifyUnion<Exclude<T, L>>, L>;
type ObjectValuesToTuple<T, KS extends any[] = TuplifyUnion<keyof T>, R extends any[] = []> = KS extends [
  infer K,
  ...infer KT,
]
  ? ObjectValuesToTuple<T, KT, [...R, T[K & keyof T]]>
  : R;
type SelectStructuredInputs<Params extends unknown[], Paths extends Record<string, unknown>> = {
  [Property in keyof Paths]: Paths[Property] extends PathingtonPath
    ? PickDeep<Params[0], Paths[Property]>
    : Paths[Property] extends PathObject
      ? Paths[Property]['argIndex'] extends number
        ? Paths[Property]['argIndex']
        : PickDeep<Params[0], Paths[Property]['path']>
      : Paths[Property] extends ManualSelectInput<Params>
        ? ReturnType<Paths[Property]>
        : never;
};
type ComputeValue<Params extends unknown[], Paths extends unknown[], Result> = (
  ...values: SelectInputs<WidenUnknown<Params>, Paths>
) => Result;
type StructuredValues<Params extends unknown[], Paths extends Record<string, unknown>> = ObjectValuesToTuple<
  SelectStructuredInputs<Params, Paths>
>;
type ComputeStructuredValue<Params extends unknown[], Paths extends Record<string, unknown>, Result> = (
  ...values: StructuredValues<Params, Paths>
) => Result;
type IdentitySelectorFn<Params extends unknown[], Paths extends unknown[]> = (
  ...params: Params
) => SelectInputs<WidenUnknown<Params>, Paths>[0];
type IdentitySelector<Params extends unknown[], Paths extends unknown[]> = IdentitySelectorFn<Params, Paths>
  & DefaultMemoizeFields;
type IdentityStructuredSelectorFn<Params extends unknown[], Paths extends Record<string, unknown>> = (
  ...params: Params
) => SelectStructuredInputs<WidenUnknown<Params>, Paths>;
type IdentityStructuredSelector<
  Params extends unknown[],
  Paths extends Record<string, unknown>,
> = IdentityStructuredSelectorFn<Params, Paths> & DefaultMemoizeFields;
type StandardSelectorFn<Params extends unknown[], Result> = (...params: Params) => Result;
type StandardSelector<Params extends unknown[], Result> = StandardSelectorFn<Params, Result> & DefaultMemoizeFields;

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
declare function createSelector<Args>(options?: CreateSelectorOptions): {
  <const Paths extends [Path<Args extends unknown[] ? Args : [Args]>]>(
    paths: Paths,
    getComputedValue?: undefined,
  ): IdentitySelector<Args extends unknown[] ? Args : [Args], Paths>;
  <
    const Paths extends Array<Path<Args extends unknown[] ? Args : [Args]>>,
    GetComputedValue extends ComputeValue<Args extends unknown[] ? Args : [Args], Paths, any>,
  >(
    paths: Paths,
    getComputedValue: GetComputedValue,
  ): StandardSelector<Args extends unknown[] ? Args : [Args], ReturnType<GetComputedValue>>;
  <const Paths extends PathStructured<Args extends unknown[] ? Args : [Args]>>(
    paths: Paths,
  ): IdentityStructuredSelector<Args extends unknown[] ? Args : [Args], Paths>;
  <
    const Paths extends PathStructured<Args extends unknown[] ? Args : [Args]>,
    GetComputedValue extends ComputeStructuredValue<Args extends unknown[] ? Args : [Args], Paths, any>,
  >(
    paths: Paths,
    getComputedValue: GetComputedValue,
  ): StandardSelector<Args extends unknown[] ? Args : [Args], ReturnType<GetComputedValue>>;
};

export { createSelector };
