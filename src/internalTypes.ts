import type { Path, PathItem } from 'pathington';

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
