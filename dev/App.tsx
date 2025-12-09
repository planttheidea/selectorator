import { memoize } from 'micro-memoize';
import { createSelector } from '../src/index.js';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = '0';
document.body.style.padding = '0';

interface Item {
  value: number;
}

const getSubtotal = createSelector(
  ['shop.items'],
  (items: Item[]) => {
    return items.reduce<number>((sum, { value }) => {
      return sum + value;
    }, 0);
  },
  { memoizer: memoize },
);
const getTax = createSelector([getSubtotal, 'shop.taxPercent'], (subtotal: number, taxPercent: number) => {
  return subtotal * (taxPercent / 100);
});
const getTotal = createSelector([getSubtotal, getTax], (subtotal: number, tax: number) => {
  return subtotal + tax;
});

const state = {
  shop: {
    taxPercent: 8,
    items: [
      { name: 'apple', value: 1.2 },
      { name: 'orange', value: 0.95 },
    ],
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
  (foo: string) => {
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

const getMultipleParams = createSelector(
  ['foo.bar', { path: 'baz', argIndex: 1 }, { path: 0, argIndex: 2 }],
  (bar: string, baz: string, quz: string) => {
    return [bar, baz, quz];
  },
);

const first = {
  foo: {
    bar: 'baz',
  },
};
const second = {
  baz: 'quz',
};
const third = ['blah'];

console.log('mutiple params', getMultipleParams(first, second, third));

// try {
//   createSelector(null as any); // fix for strict mode
// } catch (error) {
//   console.error(error);
// }

// try {
//   createSelector([]);
// } catch (error) {
//   console.error(error);
// }

export function App() {
  return (
    <div>
      <h1>App</h1>
    </div>
  );
}
