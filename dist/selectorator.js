(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("selectorator", [], factory);
	else if(typeof exports === 'object')
		exports["selectorator"] = factory();
	else
		root["selectorator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getArgsToPass = getArgsToPass;
exports.getAreArgsFilled = getAreArgsFilled;
exports.default = curry;

var _isPlaceholder = __webpack_require__(22);

var _isPlaceholder2 = _interopRequireDefault(_isPlaceholder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function getArgsToPass
 *
 * @description
 * get the complete args with previous placeholders being filled in
 *
 * @param {Array<*>} originalArgs the arguments from the previous run
 * @param {Array<*>} nextArgs the arguments from the next run
 * @returns {Array<*>} the complete list of args
 */
function getArgsToPass(originalArgs, nextArgs) {
  var argsToPass = [],
      index = -1;

  while (++index < originalArgs.length) {
    argsToPass[index] = (0, _isPlaceholder2.default)(originalArgs[index]) && nextArgs.length ? nextArgs.shift() : originalArgs[index];
  }

  return nextArgs.length ? argsToPass.concat(nextArgs) : argsToPass;
}

/**
 * @function getAreArgsFilled
 *
 * @description
 * determine if the args are considered filled based on matching arity and not having any placeholders
 *
 * @param {Array<*>} args the args passed to the function
 * @param {number} arity the arity of the function
 * @returns {boolean} are all of the args filled
 */
// utils
function getAreArgsFilled(args, arity) {
  if (args.length < arity) {
    return false;
  }

  var index = -1;

  while (++index < arity) {
    if ((0, _isPlaceholder2.default)(args[index])) {
      return false;
    }
  }

  return true;
}

/**
 * @function curry
 *
 * @description
 * get the method passed as a curriable method based on its parameters
 *
 * @param {function} fn the method to make curriable
 * @param {number} [arity=fn.length] the arity of fn
 * @returns {function(*): *} the fn passed as a curriable method
 */
function curry(fn) {
  var arity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : fn.length;

  return function curried() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return getAreArgsFilled(args, arity) ? fn.apply(this, args) : function () {
      for (var _len2 = arguments.length, nextArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nextArgs[_key2] = arguments[_key2];
      }

      return curried.apply(this, getArgsToPass(args, nextArgs));
    };
  };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * @function isArray
 *
 * @description
 * test if the item an array
 *
 * @param {*} object the object to test
 * @returns {boolean} is the item an array
 */
exports.default = Array.isArray;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(12);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isString;
/**
 * @function isString
 *
 * @description
 * test if the item a string
 *
 * @param {*} object the object to test
 * @returns {boolean} is the item a string
 */
function isString(object) {
  return typeof object === 'string';
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = coalesceToArray;

var _isArray = __webpack_require__(1);

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function coalesceToArray
 *
 * @description
 * coalesce the value passed to an array if it is not already one
 *
 * @param {*} value the value to possibly coalesce
 * @returns {Array<*>} the coalesced array
 */
function coalesceToArray(value) {
  return (0, _isArray2.default)(value) ? value : [value];
} // utils

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = isObject;
/**
 * @function isObject
 *
 * @description
 * test if the item a object
 *
 * @param {*} object the object to test
 * @returns {boolean} is the item a object
 */
function isObject(object) {
  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && !!object && object.constructor === Object;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_identity__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_identity___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_identity__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_isArray__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_isArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_isArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_isPlainObject__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_isPlainObject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_isPlainObject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(20);
// external dependencies




// utils


/**
 * @module selectorator
 */

/**
 * @function createSelector
 * 
 * @description
 * create a selector without any boilerplate code
 *
 * @example
 * import createSelector from 'selectorator';
 *
 * const getFilteredItems = createSelector(['items', 'filter.value'], (items, filterValue) => {
 *   return items.filter((item) => {
 *     return item.indexOf(filterValue) !== -1;
 *   });
 * });
 *
 * const state = {
 *   items: ['foo', 'bar', 'foo-bar'],
 *   filter: {
 *     value: 'foo'
 *   }
 * };
 *
 * console.log(getFilteredItems(state)); // ['foo', 'foo-bar'];
 * console.log(getFilteredItems(state)); // ['foo', 'foo-bar'], pulled from cache;
 *
 * @param {Array<function|string>|Object} paths paths to retrieve from state as parameters in getComputedValue, or 
 * an object of key => path pairs that will assign path at state to key in structured selector
 * @param {function} [getComputedValue=identity] function that will accept the values at paths in state as parameters
 * and compute the next result
 * @param {Object} [options={}] additional options available for selector creation
 * @param {boolean} [options.deepEqual=false] should strict equality be used for memoization
 * @param {function} [options.memoizer=defaultMemoize] custom memoize function for creating selectors with
 * @param {Array<*>} [options.memoizerParams=[]] additional parameters to pass to the selectorCreator function
 * @returns {function} selector for state object passed
 */
var createSelector = function createSelector(paths) {
  var getComputedValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0_lodash_identity___default.a;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var selectorCreator = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* getSelectorCreator */])(options);

  if (__WEBPACK_IMPORTED_MODULE_2_lodash_isPlainObject___default()(paths)) {
    return Object(__WEBPACK_IMPORTED_MODULE_3__utils__["c" /* getStructuredSelector */])(paths, selectorCreator);
  }

  if (!__WEBPACK_IMPORTED_MODULE_1_lodash_isArray___default()(paths)) {
    Object(__WEBPACK_IMPORTED_MODULE_3__utils__["d" /* throwInvalidPathsError */])();
  }

  if (!paths.length) {
    Object(__WEBPACK_IMPORTED_MODULE_3__utils__["e" /* throwNoPathsError */])();
  }

  return Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* getStandardSelector */])(paths, selectorCreator, getComputedValue);
};

/* harmony default export */ __webpack_exports__["default"] = (createSelector);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(11),
    getPrototype = __webpack_require__(17),
    isObjectLike = __webpack_require__(19);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(2),
    getRawTag = __webpack_require__(15),
    objectToString = __webpack_require__(16);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(13);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(2);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(18);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export typeOf */
/* unused harmony export isFunction */
/* unused harmony export isNumber */
/* unused harmony export isString */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return throwInvalidPathsError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return throwNoPathsError; });
/* unused harmony export throwInvalidPathError */
/* unused harmony export createIdentitySelector */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getSelectorCreator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getStandardSelector; });
/* unused harmony export getStructuredObject */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getStructuredSelector; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kari_equals__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kari_equals___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_kari_equals__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_kari_get__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_kari_get___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_kari_get__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_kari_map__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_kari_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_kari_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_kari_reduce__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_kari_reduce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_kari_reduce__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_reselect__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_reselect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_reselect__);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// external dependencies






/**
 * @private
 *
 * @function typeOf
 *
 * @description
 * creates a method that will return true or false if the value is the typeof the type passed
 *
 * @param {string} type the type to test against
 * @returns {function(*): boolean} the method to test if the value is the typeof type
 */
var typeOf = function typeOf(type) {
  return function (value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type;
  };
};

var isFunction = typeOf('function');
var isNumber = typeOf('number');
var isString = typeOf('string');

/**
 * @private
 *
 * @function throwInvalidPathsError
 *
 * @description
 * throw the error that the paths value is not of the correct type
 */
var throwInvalidPathsError = function throwInvalidPathsError() {
  throw new TypeError('First parameter passed must be either an array or a plain object. If you are creating a ' + 'standard selector, pass an array of either properties on the state to retrieve, or custom selector functions. ' + 'If creating a structured selector, pass a plain object with source and destination properties, where source ' + 'is an array of properties or custom selector functions, and destination is an array of property names to ' + 'assign the values from source to.');
};

/**
 * @private
 *
 * @function throwNoPathsError
 *
 * @description
 * throw the error that no paths exist
 */
var throwNoPathsError = function throwNoPathsError() {
  throw new ReferenceError('You have not provided any values for paths, so no values can be retrieved from state.');
};

/**
 * @private
 *
 * @function throwInvalidPathError
 *
 * @description
 * throw the error that the path type is not a string
 */
var throwInvalidPathError = function throwInvalidPathError() {
  throw new TypeError('Path must be a string type. It can be dot or bracket notation for nested values, for example: ' + '"foo.bar" or "foo[0]".');
};

/**
 * @private
 *
 * @function createIdentitySelector
 *
 * @description
 * based on the path passed, create the identity function for it or return the function itself
 *
 * @param {function|string} path nested path to retrieve from the state object
 * @returns {function} identity function to retrive value from state for given property
 */
var createIdentitySelector = function createIdentitySelector(path) {
  if (isFunction(path)) {
    return path;
  }

  return !isString(path) && !isNumber(path) && !Array.isArray(path) ? throwInvalidPathError() : function (state) {
    return __WEBPACK_IMPORTED_MODULE_1_kari_get___default()(path, state);
  };
};

/**
 * @private
 *
 * @function getSelectorCreator
 *
 * @description
 * get the creator function to use when generating the selector
 *
 * @param {boolean} [deepEqual=false] should the memoizer be based on strict equality
 * @param {function} [memoizer] function to memoize selectors (coalesces to defaultMemoize if params are provided)
 * @param {Array<*>} [memoizerParams=[]] custom parameters to pass to the memoizer function
 * @returns {function} function to create selector with
 */
var getSelectorCreator = function getSelectorCreator(_ref) {
  var _ref$deepEqual = _ref.deepEqual,
      deepEqual = _ref$deepEqual === undefined ? false : _ref$deepEqual,
      memoizer = _ref.memoizer,
      _ref$memoizerParams = _ref.memoizerParams,
      memoizerParams = _ref$memoizerParams === undefined ? [] : _ref$memoizerParams;

  var memoizerFn = memoizer || __WEBPACK_IMPORTED_MODULE_4_reselect__["defaultMemoize"];

  if (deepEqual) {
    return __WEBPACK_IMPORTED_MODULE_4_reselect__["createSelectorCreator"].apply(undefined, [memoizerFn, __WEBPACK_IMPORTED_MODULE_0_kari_equals___default.a].concat(memoizerParams));
  }

  return memoizerParams.length || isFunction(memoizer) ? __WEBPACK_IMPORTED_MODULE_4_reselect__["createSelectorCreator"].apply(undefined, [memoizerFn].concat(memoizerParams)) : __WEBPACK_IMPORTED_MODULE_4_reselect__["createSelector"];
};

/**
 * @private
 *
 * @function getStandardSelector
 *
 * @description
 * get a standard selector based on the paths and getComputedValue provided
 *
 * @param {Array<function|string>} paths paths to retrieve values from state from
 * @param {function} selectorCreator function to create selector with
 * @param {function} getComputedValue function to compute values with, receiving properties in state based
 * on paths and returning computed values from them (defaults to pass-through identity function)
 * @returns {function} selector to return computed value from state
 */
var getStandardSelector = function getStandardSelector(paths, selectorCreator, getComputedValue) {
  return selectorCreator(paths.map(createIdentitySelector), getComputedValue);
};

/**
 * @private
 *
 * @function getStructuredObject
 *
 * @description
 * get the structured object based on the computed selector values
 *
 * @param {Array<string>} properties properties to assign values from state to
 * @returns {function(...Array<*>): Object} object of property => selected value pairs
 */
var getStructuredObject = function getStructuredObject(properties) {
  return function () {
    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }

    return __WEBPACK_IMPORTED_MODULE_3_kari_reduce___default()(function (structuredObject, property, index) {
      structuredObject[property] = values[index];

      return structuredObject;
    }, {}, properties);
  };
};

/**
 * @private
 *
 * @function getStructuredSelector
 *
 * @description
 * get an object of property => selected value pairs bsaed on paths
 *
 * @param {Object} paths property => path pairs, where path is state value to retrieve and assign to property
 * @param {function} selectorCreator function used to create selector
 * @returns {function} selector to return structured values from state
 */
var getStructuredSelector = function getStructuredSelector(paths, selectorCreator) {
  var destinationKeys = Object.keys(paths);
  var selectors = __WEBPACK_IMPORTED_MODULE_2_kari_map___default()(function (key) {
    return createIdentitySelector(paths[key]);
  }, destinationKeys);

  return selectorCreator(selectors, getStructuredObject(destinationKeys));
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _curry = __webpack_require__(0);

var _curry2 = _interopRequireDefault(_curry);

var _isEquivalent = __webpack_require__(25);

var _isEquivalent2 = _interopRequireDefault(_isEquivalent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function equals
 *
 * @description
 * does the first value equal the second value in value (not strict equality)
 *
 * @param {*} firstValue the first value to compare
 * @param {*} secondValue the second value to compare
 * @returns {boolean} are the first and second value equivalent
 */
// methods
exports.default = (0, _curry2.default)(function equals(firstValue, secondValue) {
  return (0, _isEquivalent2.default)(firstValue, secondValue);
});

// utils

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isPlaceholder;

var _ = __webpack_require__(23);

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function isPlaceholder
 *
 * @description
 * determine if the object passed is the placeholder
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object the placeholder
 */
function isPlaceholder(object) {
  return object === _2.default;
} // placeholder

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isFunction = __webpack_require__(24);

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLACEHOLDER = '__KARI_PARAMETER_PLACEHOLDER__';

/**
 * @constant {string|Symbol} __ placeholder to use if you want to pass arguments out of order
 * @default
 */
// utils
exports.default = (0, _isFunction2.default)(Symbol) ? Symbol(PLACEHOLDER) : PLACEHOLDER;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isFunction;
/**
 * @function isFunction
 *
 * @description
 * test if the item a function
 *
 * @param {*} object the object to test
 * @returns {boolean} is the item a function
 */
function isFunction(object) {
  return typeof object === 'function';
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isEquivalent;

var _getObjectClass = __webpack_require__(26);

var _getObjectClass2 = _interopRequireDefault(_getObjectClass);

var _isNAN = __webpack_require__(29);

var _isNAN2 = _interopRequireDefault(_isNAN);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @constant {RegExp} ITERATOR_COMPARE_REGEXP
 */
// utils
var ITERATOR_COMPARE_REGEXP = /(Map|Set)/;

/**
 * @constant {RegExp} OBJECT_OR_ARRAY_COMPARE_REGEXP
 */
var OBJECT_OR_ARRAY_COMPARE_REGEXP = /(Object|Array)/;

/**
 * @constant {RegExp} VALUE_OF_COMPARE_REGEXP
 */
var VALUE_OF_COMPARE_REGEXP = /(Date|Boolean|Number|String)/;

/**
 * @function getArrayFromIterator
 *
 * @description
 * convert an Iterator into an array based on its values
 *
 * @param {Iterator} iterator the iterator to call
 * @returns {Array<*>} the array of values from the iterator
 */
function getArrayFromIterator(iterator) {
  var array = [],
      iteration = void 0;

  while ((iteration = iterator.next()) && !iteration.done) {
    array.push(iteration.value);
  }

  return array;
}

/**
 * @function isObjectOrArrayEquivalent
 *
 * @description
 * are the two objects or arrays equal in value, handling circular references
 *
 * @param {*} firstValue the first value to compare
 * @param {*} secondValue the second value to compare
 * @param {Array<*>} firstStack the first stack of objects already compared to support circular objects
 * @param {Array<*>} secondStack the second stack of objects already compared to support circular objects
 * @returns {boolean} are the first and second value equivalent
 */
function isObjectOrArrayEquivalent(firstValue, secondValue, firstStack, secondStack) {
  var firstKeys = Object.keys(firstValue);
  var secondKeys = Object.keys(secondValue);

  if (firstKeys.length !== secondKeys.length) {
    return false;
  }

  var index = -1;

  while (++index < firstStack.length) {
    if (firstStack[index] === firstValue) {
      return secondStack[index] === secondValue;
    }
  }

  firstStack.push(firstValue);
  secondStack.push(secondValue);

  index = -1;

  var key = void 0;

  while (++index < firstKeys.length) {
    key = firstKeys[index];

    /* eslint-disable no-use-before-define */
    if (!isEquivalent(firstValue[key], secondValue[key], firstStack, secondStack)) {
      /* eslint-enable */
      return false;
    }
  }

  firstStack.pop();
  secondStack.pop();

  return true;
}

/**
 * @function isEquivalent
 *
 * @description
 * are the two values passed equal in value
 *
 * @param {*} firstValue the first value to compare
 * @param {*} secondValue the second value to compare
 * @param {Array<*>} firstStack the first stack of objects already compared to support circular objects
 * @param {Array<*>} secondStack the second stack of objects already compared to support circular objects
 * @returns {boolean} are the first and second value equivalent
 */
function isEquivalent(firstValue, secondValue) {
  var firstStack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var secondStack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  if (firstValue === secondValue) {
    return true;
  }

  var objectClass = (0, _getObjectClass2.default)(firstValue);

  if (objectClass !== (0, _getObjectClass2.default)(secondValue)) {
    return false;
  }

  if ((0, _isNAN2.default)(firstValue)) {
    return (0, _isNAN2.default)(secondValue);
  }

  if (VALUE_OF_COMPARE_REGEXP.test(objectClass)) {
    return firstValue.valueOf() === secondValue.valueOf();
  }

  if (objectClass === 'Error') {
    return firstValue.name === secondValue.name && firstValue.message === secondValue.message;
  }

  if (objectClass === 'RegExp') {
    return firstValue.toString() === secondValue.toString();
  }

  if (ITERATOR_COMPARE_REGEXP.test(objectClass)) {
    return isEquivalent(getArrayFromIterator(firstValue.entries()), getArrayFromIterator(secondValue.entries()), firstStack, secondStack);
  }

  if (OBJECT_OR_ARRAY_COMPARE_REGEXP.test(objectClass)) {
    return isObjectOrArrayEquivalent(firstValue, secondValue, firstStack, secondStack);
  }

  return false;
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = getObjectClass;

var _isNull = __webpack_require__(27);

var _isNull2 = _interopRequireDefault(_isNull);

var _isUndefined = __webpack_require__(28);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function getObjectClass
 *
 * @description
 * get the object's class type
 *
 * @param {*} object the object to get the class of
 * @returns {string} the object's class
 */
// utils
function getObjectClass(object) {
  if ((0, _isNull2.default)(object)) {
    return 'Null';
  }

  if ((0, _isUndefined2.default)(object)) {
    return 'Undefined';
  }

  return Object.prototype.toString.call(object).slice(8, -1);
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isNull;
/**
 * @function isNull
 *
 * @description
 * test if the item is null
 *
 * @param {*} object the object to test
 * @returns {boolean} is the item is null
 */
function isNull(object) {
  return object === null;
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isUndefined;
/**
 * @function isUndefined
 *
 * @description
 * test if the item is undefined
 *
 * @param {*} object the object to test
 * @returns {boolean} is the item is undefined
 */
function isUndefined(object) {
  return object === void 0;
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isNAN;
/**
 * @function isNAN
 *
 * @description
 * test if the item is NaN
 *
 * @param {*} object the object to test
 * @returns {boolean} is the item is NaN
 */
function isNAN(object) {
  return object !== object;
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _curry = __webpack_require__(0);

var _curry2 = _interopRequireDefault(_curry);

var _getPath = __webpack_require__(31);

var _getPath2 = _interopRequireDefault(_getPath);

var _isEmpty = __webpack_require__(33);

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function get
 *
 * @description
 * get the value at the path passed in the object
 *
 * @param {(Array<number|string>|number|string)} path the path to get the value with
 * @param {Array<*>|Object} object the object to get the value from
 * @returns {*} the value at the path passed
 */


// utils
exports.default = (0, _curry2.default)(function get(path, object) {
  var cleanPath = (0, _getPath2.default)(path);

  if (!object || (0, _isEmpty2.default)(cleanPath)) {
    return;
  }

  var childSource = object[cleanPath[0]];

  return cleanPath.length === 1 ? childSource : get(cleanPath.slice(1), childSource);
}); // methods

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = getPath;

var _getKey = __webpack_require__(32);

var _getKey2 = _interopRequireDefault(_getKey);

var _isArray = __webpack_require__(1);

var _isArray2 = _interopRequireDefault(_isArray);

var _isString = __webpack_require__(3);

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function getDotSeparatedPath
 *
 * @description
 * get the path separated by periods as an array of strings or numbers
 *
 * @param {string} path the string path to parse
 * @returns {Array<number|string>} the parsed string path as an array path
 */
function getDotSeparatedPath(path) {
  return path.split('.').reduce(function (splitPath, pathItem) {
    return !pathItem ? splitPath : [].concat(splitPath, [(0, _getKey2.default)(pathItem)]);
  }, []);
}

/**
 * @function isQuotedKey
 *
 * @description
 * is the key passed a quoted key
 *
 * @param {string} key the key to test
 * @returns {boolean} is the key a quoted key
 */
// utils
function isQuotedKey(key) {
  return (/['|"|`]/.test(key[0]) && key[0] === key[key.length - 1]
  );
}

/**
 * @function getPath
 *
 * @description
 * the path to parsed into a valid array of keys / indices
 *
 * @param {Array<number|string>|number|string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */
function getPath(path) {
  if ((0, _isArray2.default)(path)) {
    return path;
  }

  if ((0, _isString2.default)(path)) {
    return path.split(/\[(.*?)\]/g).reduce(function (cleanPath, pathItem) {
      if (!pathItem) {
        return cleanPath;
      }

      if (isQuotedKey(pathItem)) {
        return [].concat(cleanPath, [(0, _getKey2.default)(pathItem.slice(1, -1))]);
      }

      return [].concat(cleanPath, getDotSeparatedPath(pathItem));
    }, []);
  }

  return [path];
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = getKey;
/**
 * @function getKey
 *
 * @description
 * get the key as a number if parseable
 *
 * @param {string} key the key to try to parse
 * @returns {number|string} the parsed key
 */
function getKey(key) {
  var intKey = +key;

  return "" + intKey === key ? intKey : key;
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isEmpty;

var _isArray = __webpack_require__(1);

var _isArray2 = _interopRequireDefault(_isArray);

var _isString = __webpack_require__(3);

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function isEmpty
 *
 * @description
 * is the object empty based on:
 * - is it truthy
 * - if an array, does it have length
 * - if an object, does it have keys
 * - is it anything else
 *
 * @param {*} object the object to test
 * @returns {boolean} is the item empty
 */
// utils
function isEmpty(object) {
  if (!object) {
    return true;
  }

  if ((0, _isArray2.default)(object) && !object.length) {
    return true;
  }

  return !(0, _isString2.default)(object) && !Object.keys(object).length;
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _curry = __webpack_require__(0);

var _curry2 = _interopRequireDefault(_curry);

var _coalesceToArray = __webpack_require__(4);

var _coalesceToArray2 = _interopRequireDefault(_coalesceToArray);

var _isObject = __webpack_require__(5);

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function mapArray
 *
 * @description
 * map the array to a new array based on the returns of the call with fn
 *
 * @param {function(*, number, Array<*>): *} fn the method to map with
 * @param {Array<*>} array the array of items to map
 * @returns {Array<*>} the mapped items
 */


// utils
function mapArray(fn, array) {
  var newArray = [],
      index = -1;

  while (++index < array.length) {
    newArray[index] = fn(array[index], index, array);
  }

  return newArray;
}

/**
 * @function mapObject
 *
 * @description
 * map the object to a new object based on the returns of the call with fn
 *
 * @param {function(*, string, Object): *} fn the method to map with
 * @param {Object} object the object of items to map
 * @returns {Object} the mapped items
 */
// methods
function mapObject(fn, object) {
  var keys = Object.keys(object);

  var newObject = {},
      index = -1,
      key = void 0;

  while (++index < keys.length) {
    key = keys[index];

    newObject[key] = fn(object[key], key, object);
  }

  return newObject;
}

/**
 * @function map
 *
 * @description
 * map the collection based on the returns of the call with fn
 *
 * @param {function(*, (number|string), (Array<*>|Object)): *} fn the method to map with
 * @param {Array<*>|Object} collection the collection of items to map
 * @returns {Array<*>|Object} the mapped collection
 */
exports.default = (0, _curry2.default)(function map(fn, collection) {
  return (0, _isObject2.default)(collection) ? mapObject(fn, collection) : mapArray(fn, (0, _coalesceToArray2.default)(collection));
});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _curry = __webpack_require__(0);

var _curry2 = _interopRequireDefault(_curry);

var _coalesceToArray = __webpack_require__(4);

var _coalesceToArray2 = _interopRequireDefault(_coalesceToArray);

var _isObject = __webpack_require__(5);

var _isObject2 = _interopRequireDefault(_isObject);

var _reduceArray = __webpack_require__(36);

var _reduceArray2 = _interopRequireDefault(_reduceArray);

var _reduceObject = __webpack_require__(37);

var _reduceObject2 = _interopRequireDefault(_reduceObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function reduce
 *
 * @description
 * reduce the collection to a single value based on fn
 *
 * @param {function(*, *, (number|string), (Array<*>|Object)): *} the method to reduce the collection with
 * @param {Array<*>|Object} collection the collection to reduce
 * @param {*} initialValue the initial value to start the reduction from
 * @returns {*} the reduced value
 */


// utils
exports.default = (0, _curry2.default)(function reduce(fn, initialValue, collection) {
  return (0, _isObject2.default)(collection) ? (0, _reduceObject2.default)(fn, collection, initialValue, Object.keys(collection)) : (0, _reduceArray2.default)(fn, (0, _coalesceToArray2.default)(collection), initialValue);
}); // methods

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = reduceArray;
/**
 * @function reduceArray
 *
 * @description
 * reduce the array to a new value based on the returns of the call with fn
 *
 * @param {function(*, *, number, Array<*>): *} fn the method to map with
 * @param {Array<*>} array the array of items to map
 * @param {*} value the initial value of the reduction
 * @returns {*} the reduced array
 */
function reduceArray(fn, array, value) {
  var index = -1;

  if (value === void 0) {
    value = array[0];
    array = array.slice(1);
  }

  while (++index < array.length) {
    value = fn(value, array[index], index, array);
  }

  return value;
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = reduceObject;
/**
 * @function reduceObject
 *
 * @description
 * reduce the object to a value based on the returns of the call with fn
 *
 * @param {function(*, string, Object): *} fn the method to map with
 * @param {Object} object the object of items to map
 * @param {*} value the initial value of the reduction
 * @param {Array<string>} keys the keys of the object
 * @returns {Object} the reduced object
 */
function reduceObject(fn, object, value, keys) {
  var index = -1,
      key = void 0;

  if (value === void 0) {
    value = object[keys[0]];
    keys = keys.slice(1);
  }

  while (++index < keys.length) {
    key = keys[index];

    value = fn(value, object[key], key, object);
  }

  return value;
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.defaultMemoize = defaultMemoize;
exports.createSelectorCreator = createSelectorCreator;
exports.createStructuredSelector = createStructuredSelector;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function defaultEqualityCheck(a, b) {
  return a === b;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCheck : arguments[1];

  var lastArgs = null;
  var lastResult = null;
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (lastArgs === null || lastArgs.length !== args.length || !args.every(function (value, index) {
      return equalityCheck(value, lastArgs[index]);
    })) {
      lastResult = func.apply(undefined, args);
    }
    lastArgs = args;
    return lastResult;
  };
}

function getDependencies(funcs) {
  var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(function (dep) {
    return typeof dep === 'function';
  })) {
    var dependencyTypes = dependencies.map(function (dep) {
      return typeof dep;
    }).join(', ');
    throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
  }

  return dependencies;
}

function createSelectorCreator(memoize) {
  for (var _len2 = arguments.length, memoizeOptions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    memoizeOptions[_key2 - 1] = arguments[_key2];
  }

  return function () {
    for (var _len3 = arguments.length, funcs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      funcs[_key3] = arguments[_key3];
    }

    var recomputations = 0;
    var resultFunc = funcs.pop();
    var dependencies = getDependencies(funcs);

    var memoizedResultFunc = memoize.apply(undefined, [function () {
      recomputations++;
      return resultFunc.apply(undefined, arguments);
    }].concat(memoizeOptions));

    var selector = function selector(state, props) {
      for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }

      var params = dependencies.map(function (dependency) {
        return dependency.apply(undefined, [state, props].concat(args));
      });
      return memoizedResultFunc.apply(undefined, _toConsumableArray(params));
    };

    selector.resultFunc = resultFunc;
    selector.recomputations = function () {
      return recomputations;
    };
    selector.resetRecomputations = function () {
      return recomputations = 0;
    };
    return selector;
  };
}

var createSelector = exports.createSelector = createSelectorCreator(defaultMemoize);

function createStructuredSelector(selectors) {
  var selectorCreator = arguments.length <= 1 || arguments[1] === undefined ? createSelector : arguments[1];

  if (typeof selectors !== 'object') {
    throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
  }
  var objectKeys = Object.keys(selectors);
  return selectorCreator(objectKeys.map(function (key) {
    return selectors[key];
  }), function () {
    for (var _len5 = arguments.length, values = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      values[_key5] = arguments[_key5];
    }

    return values.reduce(function (composition, value, index) {
      composition[objectKeys[index]] = value;
      return composition;
    }, {});
  });
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=selectorator.js.map