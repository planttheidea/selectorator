// test
import test from 'ava';
import {deepEqual as deepEquals} from 'fast-equals';
import * as reselect from 'reselect';
import sinon from 'sinon';

// src
import * as utils from '../src/utils';

test('if isPlainObject will return false when object is not a plain object, true if it is', (t) => {
  const object = {};
  const tests = [null, undefined, 'string', 123, /regexp/, () => {}, object, new Map(), new Set(), Symbol('symbol')];

  tests.forEach((test) => {
    const comparator = test === object ? 'true' : 'false';

    t[comparator](utils.isPlainObject(test));
  });
});

test('if isSameValueZero will return true when strictly equal', (t) => {
  const objectA = {};
  const objectB = objectA;

  t.true(utils.isSameValueZero(objectA, objectB));
});

test('if isSameValueZero will return true when both NaN', (t) => {
  const objectA = NaN;
  const objectB = NaN;

  t.true(utils.isSameValueZero(objectA, objectB));
});

test('if isSameValueZero will return false when different objects', (t) => {
  const objectA = {};
  const objectB = {};

  t.false(utils.isSameValueZero(objectA, objectB));
});

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

  const identity = utils.createIdentitySelector(path);

  t.is(typeof identity, 'function');

  const result = identity(state);

  t.is(result, value);
});

test('if createIdentitySelector creates a function that receives state and gets the value at the path array passed', (t) => {
  const path = ['foo', 0, 'bar', 'baz'];
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

  const identity = utils.createIdentitySelector(path);

  t.is(typeof identity, 'function');

  const result = identity(state);

  t.is(result, value);
});

test('if createIdentitySelector creates a function that receives state and gets the value at the path number passed', (t) => {
  const path = 0;
  const value = 'foo-bar-baz';
  const state = [
    {
      bar: {
        baz: value
      }
    }
  ];

  const identity = utils.createIdentitySelector(path);

  t.is(typeof identity, 'function');

  const result = identity(state);

  t.is(result, state[path]);
});

test('if createIdentitySelector returns the function passed when passed a function', (t) => {
  const path = () => {};
  const result = utils.createIdentitySelector(path);

  t.is(result, path);
});

test('if createIdentitySelector throws when path is not a function or string', (t) => {
  t.throws(() => {
    utils.createIdentitySelector({});
  }, TypeError);
});

test('if getSelectorCreator returns the correct createSelector function when passed no options', (t) => {
  const stub = sinon.stub(reselect, 'createSelectorCreator').returnsArg(0);

  const result = utils.getSelectorCreator({});

  t.true(stub.calledOnce);
  t.deepEqual(stub.args[0], [reselect.defaultMemoize, utils.isSameValueZero]);

  stub.restore();

  t.is(result, reselect.defaultMemoize);
});

test('if getSelectorCreator returns the correct createSelector function when deepEqual is true', (t) => {
  const stub = sinon.stub(reselect, 'createSelectorCreator').returnsArg(0);

  const result = utils.getSelectorCreator({deepEqual: true});

  t.true(stub.calledOnce);
  t.deepEqual(stub.args[0], [reselect.defaultMemoize, deepEquals]);

  stub.restore();

  t.is(result, reselect.defaultMemoize);
});

test('if getSelectorCreator returns the correct createSelector function when isEqual is provided', (t) => {
  const stub = sinon.stub(reselect, 'createSelectorCreator').returnsArg(0);
  const isEqual = () => {};

  const result = utils.getSelectorCreator({isEqual});

  t.true(stub.calledOnce);
  t.deepEqual(stub.args[0], [reselect.defaultMemoize, isEqual]);

  stub.restore();

  t.is(result, reselect.defaultMemoize);
});

test('if getSelectorCreator returns the correct createSelector function when custom memoizer is passed', (t) => {
  const memoize = sinon.spy();
  const stub = sinon.stub(reselect, 'createSelectorCreator').returnsArg(0);

  const result = utils.getSelectorCreator({memoizer: memoize});

  t.true(stub.calledOnce);
  t.deepEqual(stub.args[0], [memoize, utils.isSameValueZero]);

  stub.restore();

  t.is(result, memoize);
});

test('if getSelectorCreator returns the correct createSelector function when custom memoizer options are passed', (t) => {
  const stub = sinon.stub(reselect, 'createSelectorCreator').returnsArg(0);
  const option = 'foo';

  const result = utils.getSelectorCreator({memoizerParams: [option]});

  t.true(stub.calledOnce);
  t.deepEqual(stub.args[0], [reselect.defaultMemoize, utils.isSameValueZero, option]);

  stub.restore();

  t.is(result, reselect.defaultMemoize);
});

test('if getStandardSelector will create a selector function', (t) => {
  const result = utils.getStandardSelector(['foo.bar'], reselect.createSelector, (bar) => {
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
  const generator = utils.getStructuredObject(['foo', 'bar', 'baz']);

  t.is(typeof generator, 'function');

  const state = {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  };

  const result = generator(state.foo, state.bar, state.baz);

  t.deepEqual(result, state);
});

test('if getStructuredSelector will map selectors to specific keys in selector function', (t) => {
  const selector = utils.getStructuredSelector(
    {
      foo: 'bar.baz',
      bar: 'foo',
      baz: 'baz.foo'
    },
    reselect.createSelector
  );
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
    utils.throwInvalidPathError();
  }, TypeError);
});

test('if throwInvalidPathsError throws a type error when called', (t) => {
  t.throws(() => {
    utils.throwInvalidPathsError();
  }, TypeError);
});

test('if throwNoPathsError throws a type error when called', (t) => {
  t.throws(() => {
    utils.throwNoPathsError();
  }, ReferenceError);
});
