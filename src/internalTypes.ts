import type { ParsePath, Path, PathItem } from 'pathington';

export type AnyFn = (...args: any[]) => any;

export type UnchangedPath = number | string;
export type AnyPathWithoutObject = Exclude<AnyPath<any>, PathObject>;

export type Selector<State, Output> = (state: State) => Output;
export type SelectorMultiParam<State extends unknown[], Output> = (...state: State) => Output;

/* ----------------------------------------- */

export interface PathObject {
  argIndex: number;
  path: UnchangedPath | UnchangedPath[];
}

export type AnyPath<Params extends unknown[]> = CustomSelect<Params> | Path | PathItem | PathObject;

export interface Options {
  deepEqual?: boolean;
  isEqual?: <Value>(a: Value, b: Value) => boolean;
  memoizer?: AnyFn;
  memoizerParams?: any[];
}

export type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;
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

export type PickDeep<Params, Property extends Path | PathItem> = PickDeepInternalNormalized<
  Params,
  ParsePath<Property>
>;

type SelectInputs<Params extends unknown[], Paths extends unknown[], Values extends unknown[] = []> = Paths extends [
  infer Property,
  ...infer Remaining,
]
  ? Property extends Path | PathItem
    ? SelectInputs<Params, Remaining, [...Values, PickDeep<Params[0], Property>]>
    : Property extends PathObject
      ? SelectInputs<Params, Remaining, [...Values, PickDeep<Params[Property['argIndex']], Property['path']>]>
      : Property extends CustomSelect<Params>
        ? SelectInputs<Params, Remaining, [...Values, ReturnType<Property>]>
        : // This should never happen, but if it does then make it obvious
          SelectInputs<Params, Remaining, [...Values, never]>
  : Values;

export type IdentitySelect<Params extends unknown[], Paths extends unknown[]> = (
  ...params: Params
) => SelectInputs<WidenUnknown<Params>, Paths>;

export type CustomSelect<Params extends unknown[]> = (...params: WidenUnknown<Params>) => any;

export type Select<Params extends unknown[], Paths extends unknown[], Result> = (
  ...values: SelectInputs<WidenUnknown<Params>, Paths>
) => Result;
