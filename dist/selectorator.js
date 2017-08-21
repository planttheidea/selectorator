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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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

var _isPlaceholder = __webpack_require__(10);

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
/* 2 */
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
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kari_identity__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kari_identity___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_kari_identity__);
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
  var getComputedValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0_kari_identity___default.a;
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = identity;
/**
 * @function identity
 *
 * @description
 * function that allows straightforward passthrough of the first argument passed
 *
 * @param {*} value the value passed
 * @returns {*} the first argument passed
 */
function identity(value) {
  return value;
}

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isFunction */
/* unused harmony export isNumber */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isPlainObject; });
/* unused harmony export isString */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return throwInvalidPathsError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return throwNoPathsError; });
/* unused harmony export throwInvalidPathError */
/* unused harmony export createIdentitySelector */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getSelectorCreator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getStandardSelector; });
/* unused harmony export getStructuredObject */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getStructuredSelector; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kari_equals__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_kari_equals___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_kari_equals__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_kari_get__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_kari_get___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_kari_get__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_kari_is__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_kari_is___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_kari_is__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_kari_typeOf__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_kari_typeOf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_kari_typeOf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_reselect__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_reselect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_reselect__);
// external dependencies






var isFunction = __WEBPACK_IMPORTED_MODULE_3_kari_typeOf___default()('function');
var isNumber = __WEBPACK_IMPORTED_MODULE_3_kari_typeOf___default()('number');
var isPlainObject = __WEBPACK_IMPORTED_MODULE_2_kari_is___default()(Object);
var isString = __WEBPACK_IMPORTED_MODULE_3_kari_typeOf___default()('string');

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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _curry = __webpack_require__(0);

var _curry2 = _interopRequireDefault(_curry);

var _isEquivalent = __webpack_require__(12);

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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isPlaceholder;

var _ = __webpack_require__(11);

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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isFunction = __webpack_require__(1);

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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isEquivalent;

var _getObjectClass = __webpack_require__(13);

var _getObjectClass2 = _interopRequireDefault(_getObjectClass);

var _isNAN = __webpack_require__(2);

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = getObjectClass;

var _isNull = __webpack_require__(14);

var _isNull2 = _interopRequireDefault(_isNull);

var _isUndefined = __webpack_require__(15);

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
/* 14 */
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
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _curry = __webpack_require__(0);

var _curry2 = _interopRequireDefault(_curry);

var _getPath = __webpack_require__(17);

var _getPath2 = _interopRequireDefault(_getPath);

var _isEmpty = __webpack_require__(19);

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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = getPath;

var _getKey = __webpack_require__(18);

var _getKey2 = _interopRequireDefault(_getKey);

var _isArray = __webpack_require__(3);

var _isArray2 = _interopRequireDefault(_isArray);

var _isString = __webpack_require__(4);

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
/* 18 */
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = isEmpty;

var _isArray = __webpack_require__(3);

var _isArray2 = _interopRequireDefault(_isArray);

var _isString = __webpack_require__(4);

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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _curry = __webpack_require__(0);

var _curry2 = _interopRequireDefault(_curry);

var _isFunction = __webpack_require__(1);

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isNAN = __webpack_require__(2);

var _isNAN2 = _interopRequireDefault(_isNAN);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function is
 *
 * @description
 * is the value an instance of the constructor passed, or if undefined / null is it equal
 *
 * @param {function|null|undefined} Constructor constructor function to test value against
 * @param {*} value the value to test
 * @returns {boolean} is the value an instance of the Constructor
 */


// utils
exports.default = (0, _curry2.default)(function is(Constructor, value) {
  if (value === Constructor) {
    return true;
  }

  if ((0, _isFunction2.default)(Constructor)) {
    /* eslint-disable eqeqeq */
    return value != null && (
    /* eslint-enable */
    value === Constructor || value.constructor === Constructor);
  }

  return (0, _isNAN2.default)(Constructor) && (0, _isNAN2.default)(value);
}); // methods

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // methods


var _curry = __webpack_require__(0);

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function typeOf
 *
 * @description
 * create a function checks if the value is typeof type
 *
 * @param {*} value the value to test
 * @returns {boolean} is the value typeof type
 */
exports.default = (0, _curry2.default)(function typeOf(type, value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type;
});

/***/ }),
/* 22 */
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