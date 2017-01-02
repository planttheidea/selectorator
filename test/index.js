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
    createSelector(/foo/);
  }, TypeError);
});

test('if createSelector throws when paths is an empty array', (t) => {
  t.throws(() => {
    createSelector([]);
  }, ReferenceError);
});

test('if createSelector throws when paths is an array but getComputedValue is not a function', (t) => {
  t.throws(() => {
    createSelector(['foo'], /bar/);
  }, TypeError);
});

test('if createSelector calls getStandardSelector when paths is an array and getComputedValue is a function', (t) => {
  const spy = sinon.spy(utils, 'getStandardSelector');

  createSelector(['foo'], () => {});

  t.true(spy.calledOnce);

  spy.restore();
});
