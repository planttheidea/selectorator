type PlainObject = {
  [key: string]: any;
};

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

  export interface Options {
    deepEqual?: boolean;
    isEqual?: Function;
    memoizer?: Function;
    memoizerParams?: any[];
  }
}

export default function createSelector(
  paths: selectorator.Path[] | PlainObject,
  getComputedValue?: Function,
  options?: selectorator.Options,
): Function;
