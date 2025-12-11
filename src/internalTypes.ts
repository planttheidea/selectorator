import type { ParsePath, Path as PathArray, PathItem } from 'pathington';
import type { DefaultMemoizeFields } from 'reselect';

export type AnyFn = (...args: any[]) => any;

/* ----------------------------------------- */

export interface PathObject {
  argIndex?: number;
  path: PathingtonPath;
}

export type PathingtonPath = PathArray | PathItem;
export type Path<Params extends unknown[]> = ManualSelectInput<Params> | PathingtonPath | PathObject;
export type PathStructured<Params extends unknown[]> = Record<string, Path<Params>>;

export interface Options {
  deepEqual?: boolean;
  isEqual?: <Value>(a: Value, b: Value) => boolean;
  memoizer?: AnyFn;
  memoizerParams?: any[];
}

export type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsNull<T> = [T] extends [null] ? true : false;
export type IsKnown<T> = IsAny<T> extends false ? (IsUnknown<T> extends false ? true : false) : false;
export type IsUnknown<T> = unknown extends T ? (IsNull<T> extends false ? true : false) : false;

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

export type PickDeepInternalNormalized<Value, Property> = Property extends unknown[]
  ? PickDeepInternal<Value, Property>
  : Property extends readonly unknown[]
    ? PickDeepInternal<Value, [...Property]>
    : // When it cannot be narrowly determined, widen to ensure false positives / negatives are avoided.
      any;

export type PickDeep<Params, Property extends PathingtonPath> = PickDeepInternalNormalized<Params, ParsePath<Property>>;

export type ManualSelectInput<Params extends unknown[]> = (...params: WidenUnknown<Params>) => any;

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
        : // This should never happen, but if it does then make it obvious
          SelectInputs<Params, Remaining, [...Values, never]>
  : Values;

export type UnionToIntersection<Union> = (Union extends unknown ? (distributedUnion: Union) => void : never) extends (
  mergedIntersection: infer Intersection,
) => void
  ? Intersection & Union
  : never;

type Push<T extends any[], V> = [...T, V];
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
export type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : Push<TuplifyUnion<Exclude<T, L>>, L>;

export type ObjectValuesToTuple<T, KS extends any[] = TuplifyUnion<keyof T>, R extends any[] = []> = KS extends [
  infer K,
  ...infer KT,
]
  ? ObjectValuesToTuple<T, KT, [...R, T[K & keyof T]]>
  : R;

export type SelectStructuredInputs<Params extends unknown[], Paths extends Record<string, unknown>> = {
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

export type ComputeValue<Params extends unknown[], Paths extends unknown[], Result> = (
  ...values: SelectInputs<WidenUnknown<Params>, Paths>
) => Result;

export type StructuredValues<Params extends unknown[], Paths extends Record<string, unknown>> = ObjectValuesToTuple<
  SelectStructuredInputs<Params, Paths>
>;

export type ComputeStructuredValue<Params extends unknown[], Paths extends Record<string, unknown>, Result> = (
  ...values: StructuredValues<Params, Paths>
) => Result;

export type IdentitySelectorFn<Params extends unknown[], Paths extends unknown[]> = (
  ...params: Params
) => SelectInputs<WidenUnknown<Params>, Paths>[0];
export type IdentitySelector<Params extends unknown[], Paths extends unknown[]> = IdentitySelectorFn<Params, Paths>
  & DefaultMemoizeFields;

export type IdentityStructuredSelectorFn<Params extends unknown[], Paths extends Record<string, unknown>> = (
  ...params: Params
) => SelectStructuredInputs<WidenUnknown<Params>, Paths>;
export type IdentityStructuredSelector<
  Params extends unknown[],
  Paths extends Record<string, unknown>,
> = IdentityStructuredSelectorFn<Params, Paths> & DefaultMemoizeFields;

export type StandardSelectorFn<Params extends unknown[], Result> = (...params: Params) => Result;
export type StandardSelector<Params extends unknown[], Result> = StandardSelectorFn<Params, Result>
  & DefaultMemoizeFields;
