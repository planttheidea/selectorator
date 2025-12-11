import { memoize } from 'micro-memoize';
import { createSelector } from '../src/index.js';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = '0';
document.body.style.padding = '0';

interface Item {
  name: string;
  value: number;
}

interface State {
  shop: {
    items: Item[];
    taxPercent: number;
  };
}

const getSubtotal = createSelector<State>({ memoize })(['shop.items'], (items: Item[]) =>
  items.reduce<number>((sum, { value }) => sum + value, 0),
);
const getTax = createSelector<State>()([getSubtotal, 'shop.taxPercent'], (subtotal: number, taxPercent: number) => {
  return subtotal * (taxPercent / 100);
});
const getTotal = createSelector<State>()([getSubtotal, getTax], (subtotal: number, tax: number) => {
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

const getFlattedState = createSelector<State>()(
  {
    items: 'shop.items',
    subtotal: getSubtotal,
    tax: getTax,
    total: getTotal,
  },
  (items, subtotal, tax, total) => {
    return [items, subtotal, tax, total];
  },
);
const flattenedState = getFlattedState(state);
console.log('structured state', flattenedState);

const getFoo = createSelector<{ foo: string }>()(['foo'], (foo: string) => {
  return {
    bar: foo,
  };
});

// console.log('using serializer', getFoo({ foo: 'baz' }));
console.log(getFoo({ foo: 'baz' }));

interface IdentityState {
  foo: {
    bar: {
      baz: string[];
    };
  };
}

const getIdentity = createSelector<IdentityState>()(['foo.bar.baz[0]']);

console.log(
  getIdentity({
    foo: {
      bar: {
        baz: ['foo'],
      },
    },
  }),
);

const getMultipleParams = createSelector<[typeof first, typeof second, typeof third]>()(
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

const getStructuredParams = createSelector()(
  ['first.foo.bar', 'second.baz', 'third[0]'],
  (bar: string, baz: string, quz: string) => {
    return [bar, baz, quz];
  },
);

console.log('structured params', getStructuredParams({ first, second, third }));

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
