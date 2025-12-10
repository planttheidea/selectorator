import type { ParsePath, Path, PathItem } from 'pathington';

export type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;
export type IsNull<T> = [T] extends [null] ? true : false;
export type IsKnown<T> = IsAny<T> extends false ? (IsUnknown<T> extends false ? true : false) : false;
export type IsUnknown<T> = unknown extends T ? (IsNull<T> extends false ? true : false) : false;

export type AnyFn = (...args: any[]) => any;

export interface PathObject {
  argIndex: number;
  path: UnchangedPath | UnchangedPath[];
}

export type UnchangedPath = number | string;
export type AnyPath = Selector<any, any> | Path | PathItem | PathObject;
export type AnyPathWithoutObject = Exclude<AnyPath, PathObject>;

export interface Options {
  deepEqual?: boolean;
  isEqual?: <Value>(a: Value, b: Value) => boolean;
  memoizer?: AnyFn;
  memoizerParams?: any[];
}

export type Selector<State, Output> = (state: State) => Output;
export type SelectorMultiParam<State extends unknown[], Output> = (...state: State) => Output;

/* ----------------------------------------- */

type PickArray<U extends unknown[], I extends number> = U[I];
type PickObject<U extends object, K extends keyof U> = U[K];

type PickDeepInternal<U, P extends unknown[]> = unknown extends U
  ? unknown
  : P extends [infer Next, ...infer Rest]
    ? U extends object
      ? Next extends keyof U
        ? PickDeepInternal<PickObject<U, Next>, Rest>
        : undefined
      : U extends unknown[]
        ? Next extends number
          ? PickDeepInternal<PickArray<U, Next>, Rest>
          : undefined
        : undefined
    : U;

export type PickDeepInternalNormalized<U, P> = P extends unknown[]
  ? PickDeepInternal<U, P>
  : P extends readonly unknown[]
    ? PickDeepInternal<U, [...P]>
    : // When it cannot be narrowly determined, widen to ensure false positives / negatives are avoided.
      any;

export type PickDeep<State, P extends Path | PathItem> = PickDeepInternalNormalized<State, ParsePath<P>>;

type SelectValues<State, Paths extends AnyPath[], Values extends unknown[] = []> = Paths extends [
  infer P,
  ...infer R extends AnyPath[],
]
  ? P extends Path | PathItem
    ? SelectValues<State, R, [...Values, PickDeep<State, P>]>
    : P extends AnyFn // manual selector
      ? ReturnType<P>
      : never // path object
  : Values;

export type Select<State, Paths extends AnyPath[], Result> =
  IsKnown<State> extends false
    ? (...states: any[]) => Result
    : State extends unknown[]
      ? (...states: State) => Result
      : (...values: SelectValues<State, Paths>) => Result;
