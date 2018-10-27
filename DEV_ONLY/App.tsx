import React from 'react';
import { render } from 'react-dom';
import moize from 'moize';

import createSelector from '../src';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = '0';
document.body.style.padding = '0';

const getSubtotal: Function = createSelector(
  ['shop.items'],
  (items: PlainObject[]): number => {
    return items.reduce((sum: number, { value }: { value: number }): number => {
      return sum + value;
    },                  0);
  },
  {
    memoizer: moize.simple,
  },
);
const getTax: Function = createSelector(
  [getSubtotal, 'shop.taxPercent'],
  (subtotal: number, taxPercent: number): number => {
    return subtotal * (taxPercent / 100);
  },
);

const getTotal: Function = createSelector(
  [getSubtotal, getTax],
  (subtotal: number, tax: number): number => {
    return subtotal + tax;
  },
);

const state: PlainObject = {
  shop: {
    taxPercent: 8,
    items: [{ name: 'apple', value: 1.2 }, { name: 'orange', value: 0.95 }],
  },
};

console.log('subtotal: ', getSubtotal(state));
console.log('tax: ', getTax(state));
console.log('total: ', getTotal(state));

const getFlattedState: Function = createSelector({
  items: 'shop.items',
  subtotal: getSubtotal,
  tax: getTax,
  total: getTotal,
});

console.log('structured state', getFlattedState(state));

const getFoo: Function = createSelector(
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

const getIdentity: Function = createSelector(['foo.bar.baz[0]']);

console.log(
  getIdentity({
    foo: {
      bar: {
        baz: ['foo'],
      },
    },
  }),
);

const getMultipleParams: Function = createSelector(
  ['foo.bar', { path: 'baz', argIndex: 1 }, { path: 0, argIndex: 2 }],
  (bar: string, baz: string, quz: string): string[] => {
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
const third: string[] = ['blah'];

console.log(getMultipleParams(first, second, third));

try {
  createSelector(null);
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
