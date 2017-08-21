// test
import test from 'ava';
import equals from 'kari/equals';
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

test('if createIdentitySelector throws when path is not a function or string', (t) => {
  t.throws(() => {
    utils.createIdentitySelector({});
  }, TypeError);
});

test('if getSelectorCreator returns the standard reselect createSelector function when passed no options', (t) => {
  const result = utils.getSelectorCreator({});

  t.is(result, reselect.createSelector);
});

test('if getSelectorCreator will call createSelectorCreator with defaultMemoize and equals if deepEqual is set to true', (t) => {
  const stub = sinon.stub(reselect, 'createSelectorCreator').callsFake((memoizer, equalityCheck) => {
    t.is(memoizer, reselect.defaultMemoize);
    t.is(equalityCheck, equals);
  });

  utils.getSelectorCreator({deepEqual: true});

  t.true(stub.calledOnce);

  stub.restore();

  const result = utils.getSelectorCreator({deepEqual: true});

  t.is(typeof result, 'function');
});

test('if getSelectorCreator will call createSelectorCreator with custom memoizer', (t) => {
  const memoize = sinon.stub();
  const stub = sinon.stub(reselect, 'createSelectorCreator').callsFake((memoizer) => {
    t.is(memoizer, memoize);
  });

  utils.getSelectorCreator({memoizer: memoize});

  t.true(stub.calledOnce);

  stub.restore();
});

test('if getSelectorCreator will call createSelectorCreator with custom memoizer options', (t) => {
  const option = () => {};
  const stub = sinon.stub(reselect, 'createSelectorCreator').callsFake((memoizer, option1) => {
    t.is(memoizer, reselect.defaultMemoize);
    t.is(option1, option);
  });

  utils.getSelectorCreator({memoizerParams: [option]});

  t.true(stub.calledOnce);

  stub.restore();
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
