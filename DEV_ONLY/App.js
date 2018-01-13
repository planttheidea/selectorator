import React from 'react';
import {render} from 'react-dom';
import moize from 'moize';

import createSelector from '../src/index';

const getSubtotal = createSelector(
  ['shop.items'],
  (items) => {
    return items.reduce((sum, {value}) => {
      return sum + value;
    }, 0);
  },
  {
    memoizer: moize.simple
  }
);
const getTax = createSelector([getSubtotal, 'shop.taxPercent'], (subtotal, taxPercent) => {
  return subtotal * (taxPercent / 100);
});
const getTotal = createSelector([getSubtotal, getTax], (subtotal, tax) => {
  return subtotal + tax;
});

const state = {
  shop: {
    taxPercent: 8,
    items: [{name: 'apple', value: 1.2}, {name: 'orange', value: 0.95}]
  }
};

console.log('subtotal: ', getSubtotal(state));
console.log('tax: ', getTax(state));
console.log('total: ', getTotal(state));

const getFlattedState = createSelector({
  items: 'shop.items',
  subtotal: getSubtotal,
  tax: getTax,
  total: getTotal
});

console.log('structured state', getFlattedState(state));

const getFoo = createSelector(
  ['foo'],
  (foo) => {
    return {
      bar: foo
    };
  },
  {
    deepEqual: true
  }
);

console.log('using serializer', getFoo({foo: 'baz'}));
console.log(getFoo({foo: 'baz'}));

const getIdentity = createSelector(['foo.bar.baz[0]']);

console.log(
  getIdentity({
    foo: {
      bar: {
        baz: ['foo']
      }
    }
  })
);

const App = () => {
  return (
    <div>
      <h1>App</h1>
    </div>
  );
};

const div = document.createElement('div');

div.id = 'app-container';

render(<App />, div);

document.body.appendChild(div);
