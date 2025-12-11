# selectorator

`selectorator` is an abstraction API for creating selectors via [reselect](https://github.com/reactjs/reselect) with
less boilerplate code.

- [selectorator](#selectorator)
  - [Usage](#usage)
  - [Selection types](#selection-types)
  - [Default selectors](#default-selectors)
    - [Single item](#single-item)
    - [Multiple items](#multiple-items)
  - [TypeScript](#typescript)
  - [Options](#options)

## Usage

```ts
import { createSelector } from 'selectorator';

interface State {
  foo: {
    bar: string;
  };
  baz: string;
}

const getBarBaz = createSelector<State>()(['foo.bar', 'baz'], (bar, baz) => `${bar} ${baz}`);

const state = {
  foo: { bar: 'bar' },
  baz: 'baz',
};

console.log(getBarBaz(state)); // "bar baz"
```

Not a whole lot of magic here, just simplifying the creation of the "identity selectors" that `reselect` requires,
instead replacing them with a convenient and flexible syntax for retrieval of a nested property in the state object. See
[selection types](#selection-types) for more details. It should be noted the list of input selectors _must_ be wrapped
in an array:

```ts
// not allowed
const getThing = createSelector<State>()('thing');
// works
const getThing = createSelector<State>()(['thing']);
```

This is because it allows for narrow typing to flow throughout. This is also the reason for the curried approach, which
you can get more details [here](#typescript). But because of that curried structure, it is a common practice to create
an app- or state-specific selector:

```ts
import { createSelector } from 'selectorator';
import type { AppState } from './types';

export const createAppSelector = createSelector<AppState>();
```

This avoids the boilerplate of passing the type and currying all uses across the app. Here is the example from the
`reselect` README modified to use `selectorator` which uses this to compose selectors:

```ts
import { createAppSelector } from './utils';

// subtotal built using simple method
const getSubtotal = createAppSelector(['shop.items'], (items) => items.reduce((sum, { value }) => sum + value, 0));

// tax built with simple method combined with other selector
const getTax = createAppSelector(
  [getSubtotal, 'shop.taxPercent'],
  (subtotal, taxPercent) => subtotal * (taxPercent / 100),
);

// total built entirely with other selectors
const getTotal = createAppSelector([getSubtotal, getTax], (subtotal, tax) => subtotal + tax);

// example state
const state = {
  shop: {
    taxPercent: 8,
    items: [
      { name: 'apple', value: 1.2 },
      { name: 'orange', value: 0.95 },
    ],
  },
};

console.log('subtotal: ', getSubtotal(state)); // 2.15
console.log('tax: ', getTax(state)); // 0.172
console.log('total: ', getTotal(state)); // 2.322
```

## Selection types

For compatibility and compisition, passing a manual selector like in the upstream `reselect` library is supported.

```ts
const getThing = createSelector<State>()([(state) => state.thing]);
```

In addition, `selectorator` uses [`pathington`](https://www.npmjs.com/package/pathington) under-the-hood for path
parsing, and that can be leveraged to retrieve nested values:

- Pulls from state (the first argument passed):
  - `string` => `'foo[0].bar'` (pulls from `state.foo[0].bar`)
  - `number` => `0` (pulls from `state[0]`)
  - `Array` => `['foo', 0, 'bar']` (pulls from `state.foo[0].bar`)

If passing multiple parameters (e.g., `selector(state, props)`), you can leverage the object option wrapper to specify
which argument to select from.

```ts
const getThings = createSelector<[State, Props]>()({
  stateThing: 'thing',
  propsThing: { argIndex: 1, path: 'thing' },
});
```

Both manual and `pathington` path selection types are supported in object form.

## Default selectors

To help minimize boilerplate, `selectorator` has default computation selectors for common use-cases.

### Single item

For a selector that only retrieves a single state value, it returns that value.

```ts
interface {
  nested: {
    thing: string;
  }
}

const getThing = createSelector<State>()(['nested.thing']);
// `getThing` has signature `(state: State) => string`
```

### Multiple items

If you want to retrieve multiple items, then you can use a structured selector.

```ts
interface {
  nested: {
    thing: string;
    otherThing: number;
  }
}

const getThing = createSelector<State>()({
  thing: 'nested.thing',
  otherThing: ['nested', 'otherThing'],
});
// `getThing` has signature `(state: State) => { thing: string; otherThing: string }`
```

The reason a structured selector is used is because this automatically ascribes a name to the selected values, which is
a much more natural consumption mechnanism than destructuring an array of results. It also allows for smaller diffs if
selections are added / removed.

## TypeScript

To support simple and fluid typing, a currying syntax is used to allow narrow typing for input selectors, as well as the
computation selector. When creating a selector that accepts multiple params, the state should be array of the input
types, e.g. `createSelector<[State, number[], boolean]>(options)`.

```ts
import { createSelector } from 'selectorator';

interface State {
  foo: {
    bar: string;
  };
  baz: string;
}

interface Props {
  quz: number[];
}

// `State` is input type
const getBarBaz = createSelector<State>()([({ foo }) => foo, 'baz'], (foo, baz) => `${foo.bar} ${baz}`);
// `(state) => state.foo` has type signature `(state: State) => string`
// `(foo, baz) => `${foo.bar} ${baz}` has type signature `(foo: { bar: string }, baz: string) => string`
// `getBarBaz() `has type signature: `(state: State) => string`;

// State and `Props` are type  input types
const getBarBaz = createSelector<[State, Props]>(
  [({ foo }) => foo, 'baz', 'baz', { path: ['quz', 0], argIndex: 1 }],
  (foo, baz, quz) => [`${foo.bar} ${baz}`, quz] as const,
);
// `(state) => state.foo` has type signature `(state: State) => string`
// `(foo, baz, quz) => `[`${foo.bar} ${baz}`, quz] as const` has type signature
//    `(foo: { bar: string }, baz: string, quz: number) => readonly [string, number]`
// `getBarBaz() `has type signature: `(state: State, props: Props) => readonly [string, number]`;
```

If you pass a very wide type, or no type at all, `any` is used for all values.

```ts
// `any` is input type
const getBarBaz = createSelector<any>()([({ foo }) => foo, 'baz'], (foo, baz) => `${foo.bar} ${baz}`);
// `(state) => state.foo` has type signature `(state: any) => string`
// `(foo, baz) => `${foo.bar} ${baz}` has type signature `(foo: any, baz: string) => string`
// `getBarBaz() `has type signature: `(state: any) => string`;

// `unknown` is input type (either inferred when not passed, or can be explicitly passed)
const getBarBaz = createSelector()([({ foo }) => foo, 'baz'], (foo, baz) => `${foo.bar} ${baz}`);
// `(state) => state.foo` has type signature `(state: any) => string`
// `(foo, baz) => `${foo.bar} ${baz}` has type signature `(foo: any, baz: string) => string`
// `getBarBaz() `has type signature: `(state: any) => string`;
```

The narrow typing is also available for structured selectors!

```ts
const getStucturedBarBaz = createSelector<[State, Props]>(
  {
    foo: ({ foo }) => foo,
    baz: 'baz',
    quz: { argIndex: 1, path: ['quz', 0] },
  },
  (foo, baz, quz) => [`${foo.bar} ${baz}`, quz] as const,
);

// getStructuredBarBaz() has type signature: (foo: { bar: string }, baz: string, quz: number) => readonly [string, number];
```

## Options

If desired for customization, you can pass through the
[`createSelectorCreator` options in `reselect`](https://reselect.js.org/api/createSelectorCreator#parameters-since-500)
when creating the selector.

```ts
import { deepEqual } from 'fast-equals';
import { createSelector } from 'selectorator';
import type { AppState } from './types';

export const createAppSelector = createSelector<AppState>({
  argsMemoizeOptoins: { resultEqualityCheck: deepEqual },
  memoizeOptions: { resultEqualityCheck: deepEqual },
});
```
