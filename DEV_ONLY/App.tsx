import React from 'react';
import { render } from 'react-dom';
import moize from 'moize';

import createSelector from '../src';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = '0';
document.body.style.padding = '0';

const getSubtotal = createSelector<{ shop: any }, number>(
  ['shop.items'],
  (items: { value: number }[]) => {
    return items.reduce((sum: number, { value }) => {
      return sum + value;
    },                  0);
  },
  {
    memoizer: moize.simple,
  },
);
const getTax = createSelector(
  [getSubtotal, 'shop.taxPercent'],
  (subtotal: number, taxPercent: number) => {
    return subtotal * (taxPercent / 100);
  },
);

const getTotal = createSelector(
  [getSubtotal, getTax],
  (subtotal: number, tax: number) => {
    return subtotal + tax;
  },
);

const state = {
  shop: {
    taxPercent: 8,
    items: [{ name: 'apple', value: 1.2 }, { name: 'orange', value: 0.95 }],
  },
};

console.log('subtotal: ', getSubtotal(state));
console.log('tax: ', getTax(state));
console.log('total: ', getTotal(state));

const getFlattedState = createSelector({
  items: 'shop.items',
  subtotal: getSubtotal,
  tax: getTax,
  total: getTotal,
});
console.log('structured state', getFlattedState(state));

const getFoo = createSelector(
  ['foo'],
  (foo: string): PlainObject => {
    return {
      bar: foo,
    };
  },
  {
    deepEqual: true,
  },
);

console.log('using serializer', getFoo({ foo: 'baz' }));
console.log(getFoo({ foo: 'baz' }));

const getIdentity = createSelector(['foo.bar.baz[0]']);

console.log(
  getIdentity({
    foo: {
      bar: {
        baz: ['foo'],
      },
    },
  }),
);

const getMultipleParams = createSelector<
  [PlainObject, PlainObject, string[]],
  string[]
>(
  ['foo.bar', { path: 'baz', argIndex: 1 }, { path: 0, argIndex: 2 }],
  (bar: string, baz: string, quz: string) => {
    return [bar, baz, quz];
  },
);

const first: PlainObject = {
  foo: {
    bar: 'baz',
  },
};
const second: PlainObject = {
  baz: 'quz',
};
const third = ['blah'];

console.log(getMultipleParams(first, second, third));

try {
  createSelector(null as any); // fix for strict mode
} catch (error) {
  console.error(error);
}

try {
  createSelector([]);
} catch (error) {
  console.error(error);
}

function App() {
  return (
    <div>
      <h1>App</h1>
    </div>
  );
}

const div: HTMLDivElement = document.createElement('div');

div.id = 'app-container';

render(<App />, div);

document.body.appendChild(div);
