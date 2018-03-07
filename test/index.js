// test
import test from 'ava';
import sinon from 'sinon';

// src
import createSelector from '../src/index';
import * as utils from '../src/utils';

test('if createSelector calls getStructuredSelector when paths is an object', (t) => {
  const spy = sinon.spy(utils, 'getStructuredSelector');

  createSelector({
    foo: 'foo'
  });

  t.true(spy.calledOnce);

  spy.restore();
});

test('if createSelector throws when paths is not an array or object', (t) => {
  t.throws(() => {
    createSelector(false);
  }, TypeError);
});

test('if createSelector throws when paths is an empty array', (t) => {
  t.throws(() => {
    createSelector([]);
  }, ReferenceError);
});

test('if createSelector calls getSelectorCreator with the options passed', (t) => {
  const spy = sinon.spy(utils, 'getSelectorCreator');

  createSelector(['foo'], () => {}, {
    memoizer() {}
  });

  t.true(spy.calledOnce);

  spy.restore();
});

test('if createSelector calls getStandardSelector when paths is an array and getComputedValue is nor provided, and returns an identity function', (t) => {
  const spy = sinon.spy(utils, 'getStandardSelector');

  const selector = createSelector(['foo.bar.baz']);

  t.true(spy.calledOnce);

  const baz = 'baz';
  const result = selector({
    foo: {
      bar: {
        baz
      }
    }
  });

  t.is(result, baz);

  spy.restore();
});

test('if createSelector calls getStandardSelector when paths is an array and getComputedValue is a function', (t) => {
  const spy = sinon.spy(utils, 'getStandardSelector');

  createSelector(['foo'], () => {});

  t.true(spy.calledOnce);

  spy.restore();
});
