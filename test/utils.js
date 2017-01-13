// test
import test from 'ava';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import * as reselect from 'reselect';
import sinon from 'sinon';

// src
import {
  createIdentitySelector,
  getSelectorCreator,
  getStandardSelector,
  getStructuredObject,
  getStructuredSelector,
  throwInvalidPathError,
  throwInvalidPathsError,
  throwNoPathsError
} from '../src/utils';

test('if createIdentitySelector creates a function that receives state and gets the value at the path passed', (t) => {
  const path = 'foo[0].bar[baz]';
  const value = 'foo-bar-baz';
  const state = {
    foo: [
      {
        bar: {
          baz: value
        }
      }
    ]
  };

  const identity = createIdentitySelector(path);

  t.true(isFunction(identity));

  const result = identity(state);

  t.is(result, value);
});

test('if createIdentitySelector returns the function passed when passed a function', (t) => {
  const path = () => {};
  const result = createIdentitySelector(path);

  t.is(result, path);
});

test('if createIdentitySelector throws when path is not a function or string', (t) => {
  t.throws(() => {
    createIdentitySelector({});
  }, TypeError);
});

test('if getSelectorCreator returns the standard reselect createSelector function when passed no options', (t) => {
  const result = getSelectorCreator({});

  t.is(result, reselect.createSelector);
});

test('if getSelectorCreator will call createSelectorCreator with defaultMemoize and isEqual if deepEqual is set to true', (t) => {
  const stub = sinon.stub(reselect, 'createSelectorCreator', (memoizer, equalityCheck) => {
    t.is(memoizer, reselect.defaultMemoize);
    t.is(equalityCheck, isEqual);
  });

  getSelectorCreator({deepEqual: true});

  t.true(stub.calledOnce);

  stub.restore();

  const result = getSelectorCreator({deepEqual: true});

  t.true(isFunction(result));
});

test('if getSelectorCreator will call createSelectorCreator with custom memoizer', (t) => {
  const memoize = sinon.stub();
  const stub = sinon.stub(reselect, 'createSelectorCreator', (memoizer) => {
    t.is(memoizer, memoize);
  });

  getSelectorCreator({memoizer: memoize});

  t.true(stub.calledOnce);

  stub.restore();
});

test('if getSelectorCreator will call createSelectorCreator with custom memoizer options', (t) => {
  const option = () => {};
  const stub = sinon.stub(reselect, 'createSelectorCreator', (memoizer, option1) => {
    t.is(memoizer, reselect.defaultMemoize);
    t.is(option1, option);
  });

  getSelectorCreator({memoizerParams: [option]});

  t.true(stub.calledOnce);

  stub.restore();
});

test('if getStandardSelector will create a selector function', (t) => {
  const result = getStandardSelector(['foo.bar'], reselect.createSelector, (bar) => {
    return !!bar;
  });
  const state = {
    foo: {
      bar: 'baz'
    }
  };

  t.true(result(state));
});

test('if getStructuredObject will create an object of key => selector pairs', (t) => {
  const generator = getStructuredObject(['foo', 'bar', 'baz']);

  t.true(isFunction(generator));

  const state = {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  };

  const result = generator(state.foo, state.bar, state.baz);

  t.deepEqual(result, state);
});

test('if getStructuredSelector will map selectors to specific keys in selector function', (t) => {
  const selector = getStructuredSelector({
    foo: 'bar.baz',
    bar: 'foo',
    baz: 'baz.foo'
  }, reselect.createSelector);
  const state = {
    bar: {
      baz: 'foo'
    },
    baz: {
      foo: 'baz'
    },
    foo: 'bar'
  };

  const result = selector(state);

  t.deepEqual(result, {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  });
});

test('if throwInvalidPathError throws a type error when called', (t) => {
  t.throws(() => {
    throwInvalidPathError();
  }, TypeError);
});

test('if throwInvalidPathsError throws a type error when called', (t) => {
  t.throws(() => {
    throwInvalidPathsError();
  }, TypeError);
});

test('if throwNoPathsError throws a type error when called', (t) => {
  t.throws(() => {
    throwNoPathsError();
  }, ReferenceError);
});
