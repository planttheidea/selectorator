// test
import test from 'ava';
import {deepEqual as deepEquals, sameValueZeroEqual} from 'fast-equals';
import * as reselect from 'reselect';
import sinon from 'sinon';

// src
import * as utils from '../src/utils';

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

test('if createIdentitySelector will create a function that retrieves the path from the argument index requested', (t) => {
  const path = 0;
  const value = 'foo-bar-baz';
  const state = [
    {
      bar: {
        baz: 'not correct'
      }
    }
  ];
  const props = [
    {
      bar: {
        baz: value
      }
    }
  ];

  const identity = utils.createIdentitySelector({argIndex: 1, path});

  t.is(typeof identity, 'function');

  const result = identity(state, props);

  t.is(result, props[path]);
});

test('if createIdentitySelector throws when path is an object but does not have a path property', (t) => {
  t.throws(() => {
    utils.createIdentitySelector({});
  }, ReferenceError);
});

test('if createIdentitySelector throws when path is an object but does not have an argIndex property', (t) => {
  t.throws(() => {
    utils.createIdentitySelector({path: 'foo'});
  }, ReferenceError);
});

test('if createIdentitySelector throws when path is not a valid path type', (t) => {
  t.throws(() => {
    utils.createIdentitySelector(true);
  }, TypeError);
});

test('if createIdentitySelector throws when path does not exist', (t) => {
  t.throws(() => {
    utils.createIdentitySelector();
  }, TypeError);
});

test('if getSelectorCreator returns the correct createSelector function when passed no options', (t) => {
  const stub = sinon.stub(reselect, 'createSelectorCreator').returnsArg(0);

  const result = utils.getSelectorCreator({});

  t.true(stub.calledOnce);
  t.deepEqual(stub.args[0], [reselect.defaultMemoize, sameValueZeroEqual]);

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
  t.deepEqual(stub.args[0], [memoize, sameValueZeroEqual]);

  stub.restore();

  t.is(result, memoize);
});

test('if getSelectorCreator returns the correct createSelector function when custom memoizer options are passed', (t) => {
  const stub = sinon.stub(reselect, 'createSelectorCreator').returnsArg(0);
  const option = 'foo';

  const result = utils.getSelectorCreator({memoizerParams: [option]});

  t.true(stub.calledOnce);
  t.deepEqual(stub.args[0], [reselect.defaultMemoize, sameValueZeroEqual, option]);

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
