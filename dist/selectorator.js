(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("selectorator", [], factory);
	else if(typeof exports === 'object')
		exports["selectorator"] = factory();
	else
		root["selectorator"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export create */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return parse; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(6);
// constants


// utils


/**
 * @function create
 *
 * @description
 * create a new path string based on the path and quote passed
 *
 * @param {Array<number|string>} path the path to convert to a string
 * @param {string} [quote="] the quote string to use when quoting keys
 * @returns {string} the path string
 */
var create = function create(path) {
  var quote = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '"';

  if (!Array.isArray(path)) {
    throw new ReferenceError('path passed must be an array');
  }

  if (!__WEBPACK_IMPORTED_MODULE_0__constants__["g" /* VALID_QUOTES */].test(quote)) {
    throw new SyntaxError('quote ' + quote + ' passed is invalid, must be ", `, or \'.');
  }

  var pathString = path.reduce(Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* createGetNormalizedCreateKey */])(quote), '');

  return pathString[0] === '.' ? pathString.slice(1) : pathString;
};

/**
 * @function parse
 *
 * @description
 * the path parsed into a valid array of keys / indices
 *
 * @param {Array<number|string>|number|string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */
var parse = function parse(path) {
  if (typeof path === 'string') {
    return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* parseStringPath */])(path);
  }

  if (Array.isArray(path)) {
    return path.map(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* getNormalizedParseKey */]);
  }

  return [typeof path === 'number' ? path : '' + path];
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CACHE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DOTTY_WITH_BRACKETS_SYNTAX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return MAX_CACHE_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return NUMBER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return QUOTED_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return VALID_QUOTES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return VALID_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return WHITE_SPACE; });
/**
 * @constant {Object} CACHE
 *
 * @property {function} clear clear the cache results
 * @property {Object} results the map of path => array results
 * @property {number} size the size of the cache
 */
var CACHE = {
  clear: function clear() {
    CACHE.results = {};
    CACHE.size = 0;
  },

  results: {},
  size: 0
};

/**
 * @constant {RegExp} DOTTY_WITH_BRACKETS_SYNTAX
 */
var DOTTY_WITH_BRACKETS_SYNTAX = /"[^"]+"|`[^`]+`|'[^']+'|[^.[\]]+/g;

/**
 * @constant {number} MAX_CACHE_SIZE
 */
var MAX_CACHE_SIZE = 500;

/**
 * @constant {RegExp} NUMBER
 */
var NUMBER = /^\d+$/i;

/**
 * @constant {RegExp} QUOTED_KEY
 */
var QUOTED_KEY = /^"[^"]+"|`[^`]+`|'[^']+'$/;

/**
 * @constant {Array<string>} VALID_QUOTES
 */
var VALID_QUOTES = /^["'`]{1}$/;

/**
 * @constant {RegExp} VALID_KEY
 */
var VALID_KEY = /^\d+$|^[a-zA-Z_$][\w$]+$/;

/**
 * @constant {RegExp} WHITE_SPACE
 */
var WHITE_SPACE = /\s/;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return createIsSameValueZero; });
/* unused harmony export toPairs */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return areIterablesEqual; });
var createIsSameValueZero = function createIsSameValueZero() {
  /**
   * @function isSameValueZero
   *
   * @description
   * are the objects passed strictly equal or both NaN
   *
   * @param {*} objectA the object to compare against
   * @param {*} objectB the object to test
   * @returns {boolean} are the objects equal by the SameValueZero principle
   */
  return function (objectA, objectB) {
    return objectA === objectB || objectA !== objectA && objectB !== objectB;
  };
};

/**
 * @function toPairs
 *
 * @param {Map|Set} iterable the iterable to convert to [key, value] pairs (entries)
 * @returns {{keys: Array<*>, values: Array<*>}} the [key, value] pairs
 */
var toPairs = function toPairs(iterable) {
  var pairs = { keys: new Array(iterable.size), values: new Array(iterable.size) };

  var index = 0;

  iterable.forEach(function (value, key) {
    pairs.keys[index] = key;
    pairs.values[index++] = value;
  });

  return pairs;
};

/**
 * @function areIterablesEqual
 *
 * @description
 * determine if the iterables are equivalent in value
 *
 * @param {Map|Set} objectA the object to test
 * @param {Map|Set} objectB the object to test against
 * @param {function} comparator the comparator to determine deep equality
 * @param {boolean} shouldCompareKeys should the keys be tested in the equality comparison
 * @returns {boolean} are the objects equal in value
 */
var areIterablesEqual = function areIterablesEqual(objectA, objectB, comparator, shouldCompareKeys) {
  if (objectA.size !== objectB.size) {
    return false;
  }

  var pairsA = toPairs(objectA);
  var pairsB = toPairs(objectB);

  return shouldCompareKeys ? comparator(pairsA.keys, pairsB.keys) && comparator(pairsA.values, pairsB.values) : comparator(pairsA.values, pairsB.values);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_identitate__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(8);
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
  var getComputedValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0_identitate__["a" /* identity */];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var selectorCreator = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* getSelectorCreator */])(options);

  if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* isPlainObject */])(paths)) {
    return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* getStructuredSelector */])(paths, selectorCreator);
  }

  if (!Array.isArray(paths)) {
    Object(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* throwInvalidPathsError */])();
  }

  if (!paths.length) {
    Object(__WEBPACK_IMPORTED_MODULE_1__utils__["f" /* throwNoPathsError */])();
  }

  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* getStandardSelector */])(paths, selectorCreator, getComputedValue);
};

/* harmony default export */ __webpack_exports__["default"] = (createSelector);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createIdentity */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return identity; });
/* unused harmony export identitySecond */
/* unused harmony export identityLast */
/* unused harmony export identitySecondLast */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_pathington__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(7);
// external dependencies


// utils


/**
 * @function createIdentity
 *
 * @description
 * create an identity method for a specific argument index
 *
 * @param {number} argIndex the index of the argument to get
 * @param {Array<number|string>|number|string} path the nested path to retrieve the value from
 * @returns {function(...Array<*>): *} the identity method for the given argument
 */
var createIdentity = function createIdentity(argIndex, path) {
  var shouldGetNestedValue = path !== void 0;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var value = args[argIndex < 0 ? args.length + argIndex : argIndex];

    return shouldGetNestedValue ? Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* getNestedProperty */])(Object(__WEBPACK_IMPORTED_MODULE_0_pathington__["a" /* parse */])(path), value) : value;
  };
};

var identity = createIdentity(0);
var identitySecond = createIdentity(1);
var identityLast = createIdentity(-1);
var identitySecondLast = createIdentity(-2);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isNumericKey */
/* unused harmony export isQuotedKey */
/* unused harmony export shouldBeInBrackets */
/* unused harmony export shouldBeInQuotes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createGetNormalizedCreateKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getNormalizedParseKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return parseStringPath; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(1);
// constants


/**
 * @function isNumericKey
 *
 * @description
 * is the key passed a numeric string
 *
 * @param {string} key the key to test
 * @returns {boolean} is the key passed a numeric string
 */
var isNumericKey = function isNumericKey(key) {
  return !!key.length && __WEBPACK_IMPORTED_MODULE_0__constants__["d" /* NUMBER */].test(key);
};

/**
 * @function isQuotedKey
 *
 * @description
 * is the key passed a quoted key
 *
 * @param {string} key the key to test
 * @returns {boolean} is the key a quoted key
 */
var isQuotedKey = function isQuotedKey(key) {
  return __WEBPACK_IMPORTED_MODULE_0__constants__["e" /* QUOTED_KEY */].test(key);
};

/**
 * @function shouldBeInBrackets
 *
 * @description
 * should the key passed be encased in brackets when in the path string
 *
 * @param {*} key the key that is being added to the path string
 * @returns {boolean} should the key be in brackets
 */
var shouldBeInBrackets = function shouldBeInBrackets(key) {
  return typeof key === 'number' || isNumericKey(key) || isQuotedKey(key);
};

/**
 * @function shouldBeInQuotes
 *
 * @description
 * should the key passed be encased in quotes when in the path string
 *
 * @param {*} key the key that is being added to the path string
 * @returns {boolean} should the key be in quotes
 */
var shouldBeInQuotes = function shouldBeInQuotes(key) {
  return __WEBPACK_IMPORTED_MODULE_0__constants__["h" /* WHITE_SPACE */].test(key) || !__WEBPACK_IMPORTED_MODULE_0__constants__["f" /* VALID_KEY */].test(key);
};

/**
 * @function createGetNormalizedCreateKey
 *
 * @description
 * get the normalized path string based on the quote and key passed
 *
 * @param {string} [quote="] the quote string to use
 * @returns {function(string, *): string}
 */
var createGetNormalizedCreateKey = function createGetNormalizedCreateKey(quote) {
  return function (existingString, key) {
    var normalizedKey = shouldBeInQuotes(key) ? '' + quote + key + quote : key;

    return shouldBeInBrackets(normalizedKey) ? existingString + '[' + normalizedKey + ']' : existingString + '.' + normalizedKey;
  };
};

/**
 * @function getNormalizedParseKey
 *
 * @description
 * get the key as a number if parseable, or as a quoted string if applicable
 *
 * @param {string} key the key to try to parse
 * @returns {number|string} the parsed key
 */
var getNormalizedParseKey = function getNormalizedParseKey(key) {
  var cleanKey = isQuotedKey(key) ? key.substring(1, key.length - 1) : key;

  return isNumericKey(cleanKey) ? +cleanKey : cleanKey;
};

/**
 * @function parsePath
 *
 * @description
 * parse the path, memoizing the results
 *
 * @param {string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */
var parseStringPath = function parseStringPath(path) {
  if (__WEBPACK_IMPORTED_MODULE_0__constants__["a" /* CACHE */].results[path]) {
    return __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* CACHE */].results[path];
  }

  if (__WEBPACK_IMPORTED_MODULE_0__constants__["a" /* CACHE */].size > __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* MAX_CACHE_SIZE */]) {
    __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* CACHE */].clear();
  }

  __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* CACHE */].results[path] = path ? path.match(__WEBPACK_IMPORTED_MODULE_0__constants__["b" /* DOTTY_WITH_BRACKETS_SYNTAX */]).map(getNormalizedParseKey) : [path];
  __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* CACHE */].size++;

  return __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* CACHE */].results[path];
};

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getNestedProperty; });
/**
 * @function getNestedProperty
 *
 * @description
 * recursive function to get the nested property at path
 *
 * @param {Array<number|string>} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @returns {*} the retrieved values
 */
var getNestedProperty = function getNestedProperty(path, object) {
  if (path.length === 1) {
    return object ? object[path[0]] : undefined;
  }

  var property = path.shift();

  return object && object.hasOwnProperty(property) ? getNestedProperty(path, object[property]) : undefined;
};

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isPlainObject; });
/* unused harmony export isSameValueZero */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return throwInvalidPathsError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return throwNoPathsError; });
/* unused harmony export throwInvalidPathError */
/* unused harmony export createIdentitySelector */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getSelectorCreator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getStandardSelector; });
/* unused harmony export getStructuredObject */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getStructuredSelector; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fast_equals__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_reselect__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_reselect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_reselect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_unchanged__ = __webpack_require__(12);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// external dependencies




/**
 * @private
 *
 * @function isPlainObject
 *
 * @description
 * is the object passed a plain object
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object a plain object
 */
var isPlainObject = function isPlainObject(object) {
  return !!object && object.constructor === Object;
};

/**
 * @private
 *
 * @function isSameValueZero
 *
 * @description
 * are the objects passed strictly equal or both NaN
 *
 * @param {*} objectA the object to compare against
 * @param {*} objectB the object to test
 * @returns {boolean} are the objects equal by the SameValueZero principle
 */
var isSameValueZero = function isSameValueZero(objectA, objectB) {
  return objectA === objectB || objectA !== objectA && objectB !== objectB;
};

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
  var type = typeof path === 'undefined' ? 'undefined' : _typeof(path);

  if (type === 'function') {
    return path;
  }

  if (type === 'string' || type === 'number' || Array.isArray(path)) {
    return function (state) {
      return Object(__WEBPACK_IMPORTED_MODULE_2_unchanged__["a" /* get */])(path, state);
    };
  }

  throwInvalidPathError();
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

  var memoizerFn = memoizer || __WEBPACK_IMPORTED_MODULE_1_reselect__["defaultMemoize"];

  return __WEBPACK_IMPORTED_MODULE_1_reselect__["createSelectorCreator"].apply(undefined, [memoizerFn, deepEqual ? __WEBPACK_IMPORTED_MODULE_0_fast_equals__["a" /* deepEqual */] : isSameValueZero].concat(memoizerParams));
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

    return properties.reduce(function (structuredObject, property, index) {
      structuredObject[property] = values[index];

      return structuredObject;
    }, {});
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
  var selectors = destinationKeys.map(function (key) {
    return createIdentitySelector(paths[key]);
  });

  return selectorCreator(selectors, getStructuredObject(destinationKeys));
};

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createCustomEqual */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return deepEqual; });
/* unused harmony export shallowEqual */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__comparator__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(2);
// comparator


// utils


var createCustomEqual = __WEBPACK_IMPORTED_MODULE_0__comparator__["a" /* default */];

var deepEqual = Object(__WEBPACK_IMPORTED_MODULE_0__comparator__["a" /* default */])();
var shallowEqual = Object(__WEBPACK_IMPORTED_MODULE_0__comparator__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* createIsSameValueZero */]);

/* unused harmony default export */ var _unused_webpack_default_export = ({
  createCustom: createCustomEqual,
  deep: deepEqual,
  shallow: shallowEqual
});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(2);
// utils


var HAS_MAP_SUPPORT = typeof Map === 'function';
var HAS_SET_SUPPORT = typeof Set === 'function';

var isSameValueZero = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* createIsSameValueZero */])();

var createComparator = function createComparator(createIsEqual) {
  var isEqual = typeof createIsEqual === 'function' ? createIsEqual(comparator) : comparator; // eslint-disable-line

  /**
   * @function comparator
   *
   * @description
   * compare the value of the two objects and return true if they are equivalent in values
   *
   * @param {*} objectA the object to test against
   * @param {*} objectB the object to test
   * @returns {boolean} are objectA and objectB equivalent in value
   */
  function comparator(objectA, objectB) {
    if (isSameValueZero(objectA, objectB)) {
      return true;
    }

    var typeOfA = typeof objectA;

    if (typeOfA !== typeof objectB) {
      return false;
    }

    if (typeOfA === 'object' && objectA && objectB) {
      var arrayA = Array.isArray(objectA);
      var arrayB = Array.isArray(objectB);

      var index = void 0;

      if (arrayA || arrayB) {
        if (arrayA !== arrayB || objectA.length !== objectB.length) {
          return false;
        }

        for (index = 0; index < objectA.length; index++) {
          if (!isEqual(objectA[index], objectB[index])) {
            return false;
          }
        }

        return true;
      }

      var dateA = objectA instanceof Date;
      var dateB = objectB instanceof Date;

      if (dateA || dateB) {
        return dateA === dateB && isSameValueZero(objectA.getTime(), objectB.getTime());
      }

      var regexpA = objectA instanceof RegExp;
      var regexpB = objectB instanceof RegExp;

      if (regexpA || regexpB) {
        return regexpA === regexpB && objectA.source === objectB.source && objectA.global === objectB.global && objectA.ignoreCase === objectB.ignoreCase && objectA.multiline === objectB.multiline;
      }

      if (HAS_MAP_SUPPORT) {
        var mapA = objectA instanceof Map;
        var mapB = objectB instanceof Map;

        if (mapA || mapB) {
          return mapA === mapB && Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* areIterablesEqual */])(objectA, objectB, comparator, true);
        }
      }

      if (HAS_SET_SUPPORT) {
        var setA = objectA instanceof Set;
        var setB = objectB instanceof Set;

        if (setA || setB) {
          return setA === setB && Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* areIterablesEqual */])(objectA, objectB, comparator, false);
        }
      }

      var keysA = Object.keys(objectA);

      if (keysA.length !== Object.keys(objectB).length) {
        return false;
      }

      var key = void 0;

      for (index = 0; index < keysA.length; index++) {
        key = keysA[index];

        if (!Object.prototype.hasOwnProperty.call(objectB, key) || !isEqual(objectA[key], objectB[key])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  return comparator;
};

/* harmony default export */ __webpack_exports__["a"] = (createComparator);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.defaultMemoize = defaultMemoize;
exports.createSelectorCreator = createSelectorCreator;
exports.createStructuredSelector = createStructuredSelector;
function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;

  var lastArgs = null;
  var lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
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
  for (var _len = arguments.length, memoizeOptions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    memoizeOptions[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      funcs[_key2] = arguments[_key2];
    }

    var recomputations = 0;
    var resultFunc = funcs.pop();
    var dependencies = getDependencies(funcs);

    var memoizedResultFunc = memoize.apply(undefined, [function () {
      recomputations++;
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments);
    }].concat(memoizeOptions));

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    var selector = defaultMemoize(function () {
      var params = [];
      var length = dependencies.length;

      for (var i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments));
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params);
    });

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
  var selectorCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : createSelector;

  if (typeof selectors !== 'object') {
    throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
  }
  var objectKeys = Object.keys(selectors);
  return selectorCreator(objectKeys.map(function (key) {
    return selectors[key];
  }), function () {
    for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      values[_key3] = arguments[_key3];
    }

    return values.reduce(function (composition, value, index) {
      composition[objectKeys[index]] = value;
      return composition;
    }, {});
  });
}

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return get; });
/* unused harmony export has */
/* unused harmony export merge */
/* unused harmony export remove */
/* unused harmony export set */
/* unused harmony export add */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curry__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(14);
/* unused harmony reexport __ */
// utils





/**
 * @function get
 *
 * @description
 * get the value to the object at the path requested
 *
 * @param {Array<number|string>|null|number|string} path the path to get the value at
 * @param {Array<*>|Object} object the object to get the value from
 * @returns {*} the value requested
 */
var get = Object(__WEBPACK_IMPORTED_MODULE_0__curry__["a" /* curry */])(function (path, object) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* isEmptyKey */])(path) ? object : Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* getNestedProperty */])(path, object);
});

/**
 * @function has
 *
 * @description
 * does the nested path exist on the object
 *
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} object the object to get the value from
 * @returns {boolean} does the path exist
 */
var has = Object(__WEBPACK_IMPORTED_MODULE_0__curry__["a" /* curry */])(function (path, object) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* isEmptyKey */])(path) ? !!object : Object(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* hasNestedProperty */])(path, object);
});

/**
 * @function merge
 *
 * @description
 * get the deeply-merged object at path
 *
 * @param {Array<number|string>|null|number|string} path the path to match on the object
 * @param {Array<*>|Object} object the object to merge
 * @param {Array<*>|Object} object the object to merge with
 * @returns {Array<*>|Object} the new merged object
 */
var merge = Object(__WEBPACK_IMPORTED_MODULE_0__curry__["a" /* curry */])(function (path, objectToMerge, object) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_1__utils__["g" /* isCloneable */])(object)) {
    return objectToMerge;
  }

  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* isEmptyKey */])(path) ? Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* getDeeplyMergedObject */])(object, objectToMerge) : Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* getDeepClone */])(path, object, function (ref, key) {
    ref[key] = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* getDeeplyMergedObject */])(ref[key], objectToMerge);
  });
});

/**
 * @function removeobject with quoted keys
 *
 * @description
 * remove the value in the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to remove the value at
 * @param {Array<*>|Object} object the object to remove the value from
 * @returns {Array<*>|Object} a new object with the same structure and the value removed
 */
var remove = Object(__WEBPACK_IMPORTED_MODULE_0__curry__["a" /* curry */])(function (path, object) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* isEmptyKey */])(path)) {
    return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* getNewEmptyObject */])(object);
  }

  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* hasNestedProperty */])(path, object) ? Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* getDeepClone */])(path, object, function (ref, key) {
    if (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["f" /* isArray */])(ref)) {
      Object(__WEBPACK_IMPORTED_MODULE_1__utils__["i" /* splice */])(ref, key);
    } else {
      delete ref[key];
    }
  }) : object;
});

/**
 * @function set
 *
 * @description
 * set the value in the object at the path requested
 *
 * @param {Array<number|string>|number|string} path the path to set the value at
 * @param {*} value the value to set
 * @param {Array<*>|Object} object the object to set the value in
 * @returns {Array<*>|Object} a new object with the same structure and the value assigned
 */
var set = Object(__WEBPACK_IMPORTED_MODULE_0__curry__["a" /* curry */])(function (path, value, object) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* isEmptyKey */])(path) ? value : Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* getDeepClone */])(path, object, function (ref, key) {
    ref[key] = value;
  });
});

/**
 * @function add
 *
 * @description
 * add the value to the object at the path requested
 *
 * @param {Array<number|string>|null|number|string} path the path to assign the value at
 * @param {*} value the value to assign
 * @param {Array<*>|Object} object the object to assignobject the value in
 * @returns {Array<*>|Object} a new object with the same structure and the value added
 */
var add = Object(__WEBPACK_IMPORTED_MODULE_0__curry__["a" /* curry */])(function (path, value, object) {
  var nestedValue = get(path, object);
  var fullPath = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["f" /* isArray */])(nestedValue) ? (Object(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* isEmptyKey */])(path) ? '' : path) + '[' + nestedValue.length + ']' : path;

  return set(fullPath, value, object);
});

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export __ */
/* unused harmony export getPassedArgs */
/* unused harmony export isAnyPlaceholder */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return curry; });
/**
 * @constant {Symbol} __
 */
var __ = typeof Symbol === 'function' ? Symbol('placeholder') : 0xedd1;

/**
 * @function getPassedArgs
 *
 * @description
 * get the complete args with previous placeholders being filled in
 *
 * @param {Array<*>} originalArgs the arguments from the previous run
 * @param {Array<*>} nextArgs the arguments from the next run
 * @returns {Array<*>} the complete list of args
 */
var getPassedArgs = function getPassedArgs(originalArgs, nextArgs) {
  var argsToPass = originalArgs.map(function (arg) {
    return arg === __ && nextArgs.length ? nextArgs.shift() : arg;
  });

  return nextArgs.length ? argsToPass.concat(nextArgs) : argsToPass;
};

/**
 * @function isAnyPlaceholder
 *
 * @description
 * determine if any of the arguments are placeholders
 *
 * @param {Array<*>} args the args passed to the function
 * @param {number} arity the arity of the function
 * @returns {boolean} are any of the args placeholders
 */
var isAnyPlaceholder = function isAnyPlaceholder(args, arity) {
  for (var index = 0; index < arity; index++) {
    if (args[index] === __) {
      return true;
    }
  }

  return false;
};

/**
 * @function curry
 *
 * @description
 * get the method passed as a curriable method based on its parameters
 *
 * @param {function} fn the method to make curriable
 * @returns {function(*): *} the fn passed as a curriable method
 */
var curry = function curry(fn) {
  var arity = fn.length;

  var curried = function curried() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.length >= arity && !isAnyPlaceholder(args, arity) ? fn.apply(undefined, args) : function () {
      for (var _len2 = arguments.length, nextArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nextArgs[_key2] = arguments[_key2];
      }

      return curried.apply(undefined, getPassedArgs(args, nextArgs));
    };
  };

  return curried;
};

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return isCloneable; });
/* unused harmony export isGlobalConstructor */
/* unused harmony export getShallowClone */
/* unused harmony export getNewEmptyChild */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getNewEmptyObject; });
/* unused harmony export cloneIfPossible */
/* unused harmony export getNewChildClone */
/* unused harmony export onMatchAtPath */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getDeeplyMergedObject; });
/* unused harmony export getParsedPath */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getNestedProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getDeepClone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return hasNestedProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return isEmptyKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return splice; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_pathington__ = __webpack_require__(0);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// external dependencies


/**
 * @constant {Symbol} REACT_ELEMENT
 */
var REACT_ELEMENT = typeof Symbol === 'function' && Symbol.for ? Symbol.for('react.element') : 0xeac7;

/**
 * @constant {RegExp} FUNCTION_NAME
 */
var FUNCTION_NAME = /^\s*function\s*([^\(]*)/i;

/**
 * @function isArray
 */
var isArray = Array.isArray;

/**
 * @function isCloneable
 *
 * @description
 * can the object be merged
 *
 * @param {*} object the object to test
 * @returns {boolean} can the object be merged
 */
var isCloneable = function isCloneable(object) {
  return !!object && typeof object === 'object' && !(object instanceof Date || object instanceof RegExp) && object.$$typeof !== REACT_ELEMENT;
};

/**
 * @function isGlobalConstructor
 *
 * @description
 * is the function passed a global constructor function
 *
 * @param {function} fn the function to test
 * @returns {boolean} is the function a global constructor
 */
var isGlobalConstructor = function isGlobalConstructor(fn) {
  return typeof fn === 'function' && (typeof window !== 'undefined' ? window : global)[fn.name || Function.prototype.toString.call(fn).split(FUNCTION_NAME)[1]] === fn;
};

/**
 * @function getShallowClone
 *
 * @description
 * get a shallow clone of the value passed based on the type requested (maintaining prototype if possible)
 *
 * @param {Array<*>|Object} object the object to clone
 * @param {number|string} key the key to base the object type fromisReactElement(object) ||
 * @returns {Array<*>|Object} a shallow clone of the value
 */
var getShallowClone = function getShallowClone(object) {
  if (isArray(object)) {
    return object.map(function (item) {
      return item;
    });
  }

  if (object.constructor === Object) {
    return _extends({}, object);
  }

  return isGlobalConstructor(object.constructor) ? {} : Object.keys(object).reduce(function (clone, key) {
    clone[key] = object[key];

    return clone;
  }, Object.create(Object.getPrototypeOf(object)));
};

/**
 * @function getNewEmptyChild
 *
 * @description
 * get a new empty child for the type of key provided
 *
 * @param {number|string} key the key to test
 * @returns {Array|Object} the empty child
 */
var getNewEmptyChild = function getNewEmptyChild(key) {
  return typeof key === 'number' ? [] : {};
};

/**
 * @function getNewEmptyObject
 *
 * @description
 * get a new empty object for the type of key provided
 *
 * @param {Array|Object} object the object to get an empty value of
 * @returns {Array|Object} the empty object
 */
var getNewEmptyObject = function getNewEmptyObject(object) {
  return isArray(object) ? [] : {};
};

/**
 * @function cloneIfPossible
 *
 * @description
 * clone the object passed if it is mergeable, else return itself
 *
 * @param {*} object he object to clone
 * @returns {*} the cloned object
 */
var cloneIfPossible = function cloneIfPossible(object) {
  return isCloneable(object) ? getShallowClone(object) : object;
};

/**
 * @function getNewChildClone
 *
 * @description
 * get the shallow clone of the child when it is the correct type
 *
 * @param {Array<*>|Object} object the object to clone
 * @param {number|string} nextKey the key that the next object will be based from
 * @returns {Array<*>|Object} the clone of the key at object
 */
var getNewChildClone = function getNewChildClone(object, nextKey) {
  return isCloneable(object) ? getShallowClone(object) : getNewEmptyChild(nextKey);
};

/**
 * @function onMatchAtPath
 *
 * @description
 * when there is a match for the path requested, call onMatch, else return the noMatchValue
 *
 * @param {Array<number|string>} path the path to find a match at
 * @param {Array<*>|Object} object the object to find the path in
 * @param {function} onMatch when a match is found, call this method
 * @param {boolean} shouldClone should the object be cloned
 * @param {*} noMatchValue when no match is found, return this value
 * @param {number} [index=0] the index of the key to process
 * @returns {*} either the return from onMatch or the noMatchValue
 */
var onMatchAtPath = function onMatchAtPath(path, object, onMatch, shouldClone, noMatchValue) {
  var index = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  var key = path[index];
  var nextIndex = index + 1;

  if (nextIndex === path.length) {
    var result = object || shouldClone ? onMatch(object, key) : noMatchValue;

    return shouldClone ? object : result;
  }

  if (shouldClone) {
    object[key] = onMatchAtPath(path, getNewChildClone(object[key], path[nextIndex]), onMatch, shouldClone, noMatchValue, nextIndex);

    return object;
  }

  return object && object[key] ? onMatchAtPath(path, object[key], onMatch, shouldClone, noMatchValue, nextIndex) : noMatchValue;
};

/**
 * @function getDeeplyMergedObject
 *
 * @description
 * get the objects merged into a new object
 *
 * @param {Array<*>|Object} object1 the object to merge into
 * @param {Array<*>|Object} object2 the object to merge
 * @returns {Array<*>|Object} the merged object
 */
var getDeeplyMergedObject = function getDeeplyMergedObject(object1, object2) {
  var isObject1Array = isArray(object1);

  if (isObject1Array !== isArray(object2) || !isCloneable(object1)) {
    return cloneIfPossible(object2);
  }

  if (isObject1Array) {
    return object1.concat(object2.map(cloneIfPossible));
  }

  var target = Object.keys(object1).reduce(function (clone, key) {
    clone[key] = cloneIfPossible(object1[key]);

    return clone;
  }, object1.constructor === Object ? {} : Object.create(Object.getPrototypeOf(object1)));

  return Object.keys(object2).reduce(function (clone, key) {
    clone[key] = isCloneable(object2[key]) ? getDeeplyMergedObject(object1[key], object2[key]) : object2[key];

    return clone;
  }, target);
};

/**
 * @function getParsedPath
 *
 * @description
 * get the path array, either as-is if already an array, or parsed by pathington
 *
 * @param {Array<number|string>|number|string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */
var getParsedPath = function getParsedPath(path) {
  return isArray(path) ? path : Object(__WEBPACK_IMPORTED_MODULE_0_pathington__["a" /* parse */])(path);
};

/**
 * @function getNestedProperty
 *
 * @description
 * parse the path passed and get the nested property at that path
 *
 * @param {Array<number|string>|number|string} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @returns {*} the retrieved values
 */
var getNestedProperty = function getNestedProperty(path, object) {
  var parsedPath = getParsedPath(path);

  if (parsedPath.length === 1) {
    return object ? object[parsedPath[0]] : undefined;
  }

  return onMatchAtPath(parsedPath, object, function (ref, key) {
    return ref[key];
  });
};

/**
 * @function getDeepClone
 *
 * @description
 * parse the path passed and clone the object at that path
 *
 * @param {Array<number|string>|number|string} path the path to deeply modify the object on
 * @param {Array<*>|Object} object the objeisCurrentKeyArrayct to modify
 * @param {function} onMatch the callback to execute
 * @returns {Array<*>|Object} the clone object
 */
var getDeepClone = function getDeepClone(path, object, onMatch) {
  var parsedPath = getParsedPath(path);
  var topLevelClone = isCloneable(object) ? getShallowClone(object) : getNewEmptyChild(parsedPath[0]);

  if (parsedPath.length === 1) {
    onMatch(topLevelClone, parsedPath[0]);

    return topLevelClone;
  }

  return onMatchAtPath(parsedPath, topLevelClone, onMatch, true);
};

/**
 * @function hasNestedProperty
 *
 * @description
 * parse the path passed and determine if a value at the path exists
 *
 * @param {Array<number|string>|number|string} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @returns {boolean} does the nested path exist
 */
var hasNestedProperty = function hasNestedProperty(path, object) {
  var parsedPath = getParsedPath(path);

  if (parsedPath.length === 1) {
    return object ? object[parsedPath[0]] !== void 0 : false;
  }

  return onMatchAtPath(parsedPath, object, function (ref, key) {
    return !!ref && ref[key] !== void 0;
  }, false, false);
};

/**
 * @function isEmptyKey
 *
 * @description
 * is the object passed an empty key value
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object an empty key value
 */
var isEmptyKey = function isEmptyKey(object) {
  return object === void 0 || object === null || isArray(object) && !object.length;
};

/**
 * @function splice
 *
 * @description
 * splice a single item from the array
 *
 * @param {Array<*>} array array to splice from
 * @param {number} splicedIndex index to splice at
 */
var splice = function splice(array, splicedIndex) {
  if (array.length) {
    var length = array.length,
        index = splicedIndex;

    while (index < length) {
      array[index] = array[index + 1];

      index++;
    }

    array.length--;
  }
};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(15)))

/***/ }),
/* 15 */
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=selectorator.js.map