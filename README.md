# selectorator

<img src="https://img.shields.io/badge/build-passing-brightgreen.svg"/>
<img src="https://img.shields.io/badge/coverage-100%25-brightgreen.svg"/>
<img src="https://img.shields.io/badge/license-MIT-blue.svg"/>

`selectorator` is an abstraction API for creating selectors via [reselect](https://github.com/reactjs/reselect) with less boilerplate code.

## Table of contents

- [Installation](#installation)
- [Versions](#versions)
- [Usage](#usage)
  - [Shorthand types](#shorthand-types)
  - [TypeScript](#TypeScript)
- [Options](#options)
  - [deepEqual](#deepequal)
  - [isEqual](#isequal)
  - [memoizer](#memoizer)
  - [memoizerOptions](#memoizerOptions)
- [Development](#development)

## Installation

```
$ npm i selectorator --save
```

## Versions

Versions of `selectorator` on or above `3.x.x` will use the corresponding major version of `reselect` as a dependency. If you wish to still use the `2.x.x` branch of `reselect` for your application, then you should continue using the `1.x.x` branch of `selectorator`.

If you would like to learn more about the breaking changes related to the major version change for `reselect`, please visit [the `reselect` CHANGELOG](https://github.com/reactjs/reselect/blob/master/CHANGELOG.md).

## Usage

```javascript
import createSelector from "selectorator";

// selector created with single method call
const getBarBaz = createSelector(
  ["foo.bar", "baz"],
  (bar, baz) => {
    return `${bar} ${baz}`;
  }
);

const state = {
  foo: {
    bar: "bar"
  },
  baz: "baz"
};

console.log(getBarBaz(state)); // "bar baz"
```

Not a whole lot of magic here, just simplifying the creation of the "identity selectors" that `reselect` requires, instead replacing them with a standardized dot- or bracket-notation string for retrieval of a nested property in the state object.

That said, you can still use your own custom identity selectors, or compose selectors, if you so choose. Here is the example from the `reselect` README modified to use `selectorator`:

```javascript
// subtotal built using simple method
const getSubtotal = createSelector(
  ["shop.items"],
  items => {
    return items.reduce((sum, { value }) => {
      return sum + value;
    }, 0);
  }
);

// tax builtrued with simple method combined with other selector
const getTax = createSelector(
  [getSubtotal, "shop.taxPercent"],
  (subtotal, taxPercent) => {
    return subtotal * (taxPercent / 100);
  }
);

// total build entirely with other selectors
const getTotal = createSelector(
  [getSubtotal, getTax],
  (subtotal, tax) => {
    return {
      total: subtotal + tax
    };
  }
);

const state = {
  shop: {
    taxPercent: 8,
    items: [{ name: "apple", value: 1.2 }, { name: "orange", value: 0.95 }]
  }
};

console.log("subtotal: ", getSubtotal(state)); // 2.15
console.log("tax: ", getTax(state)); // 0.172
console.log("total: ", getTotal(state)); // {total: 2.322}
```

### Shorthand types

The following types of shorthand are available for parameter selector creation:

- Pulls from state:
  - `string` => `'foo[0].bar'
  - `number` => `0`
  - `Array` => `['foo', 0, 'bar']`
- Pulls from specific argument:
  - `Object` => `{path: 'foo[0].bar', argIndex: 1}`

Please note that the `Object` usage is the only approach that will allow for selection of parameters. All other shorthands will pull from the first parameter.

### TypeScript

Selectorator now supports two optional type parameters, it accepts an Input type param (usually the redux state) and the expected output type.

When creating a selector that accepts multiple params, the state should be array of the input types example

i.e `createSelector<[State, number[], boolean], string>`

```js
  import createSelector from "selectorator";

  interface State {
    foo: {
      bar: string;
    };
    baz: string;
  };
                        // State is input type, string is output type
  const getBarBaz = createSelector<State, string>(
    ["foo.bar", "baz"],
    (bar, baz) => {
      return `${bar} ${baz}`;
  });

  // getBarBaz() has type signature: (state: State) => string;

  const getBarBaz2 = createSelector<any, string>(
    ["foo.bar", "baz"],
    (bar, baz) => {
      return `${bar} ${baz}`;
  });

  // getBarBaz2() has type signature: (state: any) => string;

  const getBarBaz3 = createSelector(
    ["foo.bar", "baz"],
    (bar, baz) => {
      return `${bar} ${baz}`;
  });

  // getBarBaz3() has type signature: (state: any) => any;

  const getBarBaz4 = createSelector(
    ["foo.bar", "baz", { path: 0, argIndex: 2 }],
    (bar, baz) => {
      return `${bar} ${baz}`;
  });

  // getBarBaz4() has type signature: (...state: any[]) => any;

  const getBarBazQux5 = createSelector<[State, string[]], string>(
    ["foo.bar", "baz", { path: 0, argIndex: 2 }],
    (bar, baz) => {
      return `${bar} ${baz}`;
  });

  // getBarBaz5() has type signature: (state_0: State, state_1: string[]) => string;

  const getStucturedBarBaz = createSelector({
    barBaz: getBarBaz,
  });

  // getStructuredBarBaz() has type signature: (state: any) => ({ barBaz: string });
```

## Options

All the capabilities that exist with `reselect` are still available using `selectorator`, they are just passed as an object of options to `createSelector`.

### deepEqual

_defaults to false_

A common usage of custom selectors is to perform a deep equality check instead of the standard strict equality check when comparing values. To apply this, simply set `deepEqual` to `true`.

```javascript
import createSelector from "selectorator";

const selectoratorOptions = {
  deepEqual: true
};

const getBaz = createSelector(
  ["foo.bar.baz"],
  baz => {
    return !!baz;
  },
  selectoratorOptions
);
```

### isEqual

_defaults to isSameValueZero_

If you want to use a custom equality comparator, pass the method as this option.

```javascript
import createSelector from "selectorator";

const selectoratorOptions = {
  // silly example checking current or next values related to "foo"
  isEqual(currentFoo, nextFoo) {
    return currentFoo === "foo" || nextFoo !== "foo";
  }
};

const getFoo = createSelector(
  ["foo"],
  foo => {
    return !!foo;
  },
  selectoratorOptions
);
```

Please note that if this parameter is provided and `deepEqual` is also set to `true`, `deepEqual` will take priority and the `isEqual` method will not be used.

### memoizer

_defaults to `reselect` defaultMemoize_

If you want to use a custom memoizer, pass the method as this option. This will use `createSelectorCreator` from `reselect` internally, so consult their documentation on proper usage.

```javascript
import createSelector from "selectorator";
import moize from "moize";

const selectoratorOptions = {
  memoizer: moize
};

const getFoo = createSelector(
  ["foo"],
  foo => {
    return !!foo;
  },
  selectoratorOptions
);
```

### memoizerParams

_defaults to []_

`reselect` allows you to pass parameters to the `memoizer` function, and this array will translate directly into parameters `3`-`n`. This is useful if your `memoizer` uses something other than direct comparison for its equality test.

```javascript
import createSelector from "selectorator";

const selectoratorOptions = {
  memoizer: memoizerThatChecksEqualToEachOtherOrToSpecificValuePassed,
  memoizerParams: ["specificValue"]
};

const getFoo = createSelector(
  ["foo"],
  foo => {
    return !!foo;
  },
  selectoratorOptions
);
```

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

- `build` => run webpack to build development `dist` file with NODE_ENV=development
- `build:minifed` => run webpack to build production `dist` file with NODE_ENV=production
- `dev` => run webpack dev server to run example app (playground!)
- `docs` => builds the docs via `jsdoc`
- `lint` => run ESLint against all files in the `src` folder
- `prepublish` => runs `prepublish:compile`
- `prepublish:compile` => run `lint`, `test:coverage`, `transpile`, `build`, `build:minified`, and `docs`
- `test` => run AVA test functions with `NODE_ENV=test`
- `test:coverage` => run `test` but with `nyc` for coverage checker
- `test:watch` => run `test`, but with persistent watcher
- `transpile` => run babel against all files in `src` to create files in `lib`
