export type AnyFn = (...args: any[]) => any;

export interface PathObject {
  argIndex: number;
  path: UnchangedPath | UnchangedPath[];
}

export type UnchangedPath = number | string;
export type AnyPath = AnyFn | UnchangedPath | UnchangedPath[] | PathObject;
export type AnyPathWithoutObject = Exclude<AnyPath, PathObject>;

export interface Options {
  deepEqual?: boolean;
  isEqual?: AnyFn;
  memoizer?: AnyFn;
  memoizerParams?: any[];
}

export type Selector<State = undefined, Output = any> = {} extends State
  ? (state: any) => Output
  : (state: State) => Output;

export type SelectorMultiParam<State extends any[] = any, Output = any> = (...state: State) => Output;
