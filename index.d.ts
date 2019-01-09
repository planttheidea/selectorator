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
  /**
   * @type Selector
   *
   * @description
   * Allows the user to specify an input type and output type
   * if no input type is specified or type is undefined default to
   * generic (input: any) => any
   *
   * @example
   * import createSelector from "selectorator";
   *
   * interface State {
   * foo: {
   * bar: string;
   * };
   * baz: string;
   * }
   *                          // State is input type, string is output type
   * const getBarBaz = createSelector<State, string>(["foo.bar", "baz"], (bar, baz) => {
   *  return `${bar} ${baz}`;
   * });
   *
   * // getBarBaz() has type signature: (state: State) => string;
   *
   *   const getBarBaz2 = createSelector<any, string>(["foo.bar", "baz"], (bar, baz) => {
   *  return `${bar} ${baz}`;
   * });
   *
   * // getBarBaz2() has type signature: (state: any) => string;
   *
   *   const getBarBaz3 = createSelector(["foo.bar", "baz"], (bar, baz) => {
   *  return `${bar} ${baz}`;
   * });
   *
   * // getBarBaz3() has type signature: (state: any) => any;
   *
   *   const getBarBaz4 = createSelector(["foo.bar", "baz", { path: 0, argIndex: 2 }], (bar, baz) => {
   *  return `${bar} ${baz}`;
   * });
   *
   * // getBarBaz4() has type signature: (...state: any[]) => any;
   *
   *   const getBarBazQux5 = createSelector<[State, string[]],string>(["foo.bar", "baz", { path: 0, argIndex: 2 }], (bar, baz) => {
   *  return `${bar} ${baz}`;
   * });
   *
   * // getBarBaz5() has type signature: (state_0: State, state_1: string[]) => string;
   *
   *   const getStucturedBarBaz = createSelector({
   *     barBaz: getBarBaz,
   *   }});
   *
   * // getStructuredBarBaz() has type signature: (state: any) => ({ barBaz: string });
   *
   * const state: State = {
   *  foo: {
   *    bar: "bar"
   *  },
   *  baz: "baz"
   * };
   *
   * console.log(getBarBaz(state)); // "bar baz"
   */
  export type Selector<State = undefined, Output = any> = {} extends State
    ? (state: any) => Output
    : (state: State) => Output;
    /**
     * @type SelectorMultiParam
     * 
     * @description similar to `Selector` but allows multiple params
     */
  export type SelectorMultiParam<State extends any[] = any, Output = any> = (
    ...state: State
  ) => Output;
}

export default function createSelector< // overload to signify errors when path is empty
  State extends never,
  Output extends never
>( 
  paths: never[], 
): never;

export default function createSelector<State, Output = any>( // overload for getIdentity
  paths: selectorator.PathWithoutObject[],
): selectorator.Selector<State, Output>;

export default function createSelector<State extends any[], Output = any>( // overload for getIdentity - multiParam
  paths: selectorator.Path[],
): selectorator.SelectorMultiParam<State, Output>;

export default function createSelector< // overload for structured selectors
  State,
  Output extends PlainObject = PlainObject
>(
  paths: Output,
): selectorator.Selector<
  State,
  {
    [key in keyof Output]: Output[key] extends ((...args: any[]) => infer Return) // checks if Output[key] is a function
      ? Return                                                              // if so infer it's return value else use any
      : any
  }
>;

export default function createSelector<State, Output>( // overload for standard selector
  paths: selectorator.PathWithoutObject[],
  getComputedValue: (...args: any) => Output,
  options?: selectorator.Options,
): selectorator.Selector<State, Output>;

export default function createSelector<State extends any[], Output>( // overload for selectors with path objects
  paths: selectorator.Path[], // for multiple parameters.
  getComputedValue: (...args: any) => Output,
  options?: selectorator.Options,
): selectorator.SelectorMultiParam<State, Output>;
