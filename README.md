# selectorator

<img src="https://img.shields.io/badge/build-passing-brightgreen.svg"/>
<img src="https://img.shields.io/badge/coverage-100%25-brightgreen.svg"/>
<img src="https://img.shields.io/badge/license-MIT-blue.svg"/>

`selectorator` is an abstraction API for creating selectors via [reselect](https://github.com/reactjs/reselect) with less boilerplate code.

### Table of contents
* [Installation](#installation)
* [Versions](#versions)
* [Usage](#usage)
* [Advanced usage](#advanced-usage)
* [Development](#development)

### Installation

```
$ npm i selectorator --save
```

### Versions

Versions of `selectorator` on the `3.x.x` versions will use the `3.x.x` version of `reselect` as a dependency, and all major versions of `selectorator` will match the major versions of `reselect` going forward. If you wish to still use the `2.x.x` branch of `reselect` for your application, then you should continue using the `1.x.x` branch of `selectorator`. All future enhancements will be made to both branches, unless they are version-specific.

If you would like to learn more about the breaking changes related to the major version change for `reselect`, please visit [the `reselect` CHANGELOG](https://github.com/reactjs/reselect/blob/master/CHANGELOG.md).

### Usage

```javascript
import createSelector from 'selectorator';

// selector created with single method call
const getBarBaz = createSelector(['foo.bar', 'baz'], (bar, baz) => {
  return `${bar} ${baz}`;
});

const state = {
  foo: {
    bar: 'bar'
  },
  baz: 'baz'
};

console.log(getBarBaz(state)); // "bar baz"
```

Not a whole lot of magic here, just simplifying the creation of the "identity selectors" that `reselect` requires, instead replacing them with a standardized dot- or bracket-notation string for retrieval of a nested property in the state object.

That said, you can still use your own custom identity selectors, or compose selectors, if you so choose. Here is the example from the `reselect` README modified to use `selectorator`:

```javascript
// subtotal built using simple method
const getSubtotal = createSelector(['shop.items'], (items) => {
  return items.reduce((sum, {value}) => {
    return sum + value;
  }, 0);
});

// tax build with simple method combined with other selector
const getTax = createSelector([getSubtotal, 'shop.taxPercent'], (subtotal, taxPercent) => {
  return subtotal * (taxPercent / 100);
});

// total build entirely with other selectors
const getTotal = createSelector([getSubtotal, getTax], (subtotal, tax) => {
  return {
    total: subtotal + tax
  };
});

const state = {
  shop: {
    taxPercent: 8,
    items: [
      {name: 'apple', value: 1.20},
      {name: 'orange', value: 0.95}
    ]
  }
};

console.log('subtotal: ', getSubtotal(state)); // 2.15
console.log('tax: ', getTax(state)); // 0.172
console.log('total: ', getTotal(state)); // {total: 2.322}
```

### Advanced usage

All the capabilities that exist with `reselect` are still available using `selectorator`, they are just passed as an object of options to `createSelector`.

**deepEqual** *defaults to false*

A common usage of custom selectors is to perform a deep equality check instead of the standard strict equality check when comparing values. To apply this, simply set `deepEqual` to `true`.

```javascript
import createSelector from 'selectorator';

const selectoratorOptions = {
  deepEqual: true
};

const getBaz = createSelector(['foo.bar.baz'], (baz) => {
  return !!baz;
}, selectoratorOptions);
```

**memoizer** *defaults to `reselect` defaultMemoize*

If you want to use a custom memoizer, pass the method as this option. This will use `createSelectorCreator` from `reselect` internally, so consult their documentation on proper usage.

```javascript
import createSelector from 'selectorator';
import moize from 'moize';

const selectoratorOptions = {
  memoizer: moize
};

const getFoo = createSelector(['foo'], (foo) => {
  return !!foo;
}, selectoratorOptions);
```

**memoizerParams** *defaults to []*

`reselect` allows you to pass parameters to the `memoizer` function, and this array will translate directly into those parameters.

```javascript
import createSelector from 'selectorator';

const selectoratorOptions = {
  // silly example checking current or next values related to "foo"
  memoizerParams: [
    (currentFoo, nextFoo) => {
      return currentFoo === 'foo' || nextFoo !== 'foo';
    }
  ]
};

const getFoo = createSelector(['foo'], (foo) => {
  return !!foo;
}, selectoratorOptions);
```

### Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:
* `build` => run webpack to build development `dist` file with NODE_ENV=development
* `build:minifed` => run webpack to build production `dist` file with NODE_ENV=production
* `dev` => run webpack dev server to run example app (playground!)
* `docs` => builds the docs via `jsdoc`
* `lint` => run ESLint against all files in the `src` folder
* `prepublish` => runs `prepublish:compile`
* `prepublish:compile` => run `lint`, `test:coverage`, `transpile`, `build`, `build:minified`, and `docs`
* `test` => run AVA test functions with `NODE_ENV=test`
* `test:coverage` => run `test` but with `nyc` for coverage checker
* `test:watch` => run `test`, but with persistent watcher
* `transpile` => run babel against all files in `src` to create files in `lib`
