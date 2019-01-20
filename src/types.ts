type PlainObject = {
  [key: string]: any;
};

declare module 'identitate' {
  function identity(value: any): any;
  function createIdentity(argIndex: number): Function;
}

declare namespace selectorator {
  export interface PathObject {
    argIndex: number;
    path: string | number | (string | number)[];
  }

  export type Path =
    | Function
    | string
    | number
    | (string | number)[]
    | PathObject;

  export type PathWithoutObject =
    | Function
    | string
    | number
    | (string | number)[];

  export interface Options {
    deepEqual?: boolean;
    isEqual?: Function;
    memoizer?: Function;
    memoizerParams?: any[];
  }

  export type Selector<State = undefined, Output = any> = {} extends State
    ? (state: any) => Output
    : (state: State) => Output;

  export type SelectorMultiParam<State extends any[] = any, Output = any> = (
    ...state: State
  ) => Output;
}
