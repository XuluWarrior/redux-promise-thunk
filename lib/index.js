'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _steps;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var START = 'START';
var COMPLETED = 'COMPLETED';
var FAILED = 'FAILED';
var steps = (_steps = {}, _defineProperty(_steps, START, 'START'), _defineProperty(_steps, COMPLETED, 'COMPLETED'), _defineProperty(_steps, FAILED, 'FAILED'), _steps);

function createPromiseThunk(type, promiseCreator, metaCreator) {
  var _this = this;

  var typeMap = getTypeMap(type);
  var getType = function getType(step) {
    return typeMap[step];
  };
  var getMeta = isFunction(metaCreator) ? metaCreator : getMetaByStep(metaCreator);

  function createActionForStep(step, payload) {
    return createAction(getType(step), payload, getMeta(step, type));
  }

  return function (data) {
    return function (dispatch, getState) {
      dispatch(createActionForStep(START, data));

      var promise = promiseCreator.call(_this, data, dispatch, getState);

      if (promise && promise.then) {
        return promise.then(function (result) {
          dispatch(createActionForStep(COMPLETED, result));
        }, function (err) {
          dispatch(createActionForStep(FAILED, err));
        });
      } else {
        throw new TypeError('The return of promiseCreator must be a promise object');
      }
    };
  };
}

var setupSteps = function setupSteps(customSteps) {
  return steps = _extends({ steps: steps }, customSteps);
};

var isArray = Array.isArray; //todo: polyfill
var isFunction = function isFunction(target) {
  return typeof target === 'function';
};

var getDefaultTypeByStep = function getDefaultTypeByStep(type) {
  return function (step) {
    return type + '_' + steps[step];
  };
};

var getTypeMap = function getTypeMap(type) {
  if (isArray(type)) {
    var _ref;

    var _type = _slicedToArray(type, 3);

    var startType = _type[0];
    var completedType = _type[1];
    var failedType = _type[2];

    return _ref = {}, _defineProperty(_ref, START, startType), _defineProperty(_ref, COMPLETED, completedType), _defineProperty(_ref, FAILED, failedType), _ref;
  } else {
    var _ref2;

    return _ref2 = {}, _defineProperty(_ref2, START, getDefaultTypeByStep(type)(START)), _defineProperty(_ref2, COMPLETED, getDefaultTypeByStep(type)(COMPLETED)), _defineProperty(_ref2, FAILED, getDefaultTypeByStep(type)(FAILED)), _ref2;
  }
};

var getMetaByStep = function getMetaByStep(meta) {
  return function (step, type) {
    return _extends({ asyncType: type, asyncStep: step }, meta);
  };
};

function createAction(type, payload, meta) {
  var action = {
    type: type,
    payload: payload,
    meta: meta
  };

  if (payload instanceof Error) {
    action.error = true;
  }

  return action;
}

exports['default'] = {
  createPromiseThunk: createPromiseThunk,
  setupSteps: setupSteps,
  steps: steps
};
module.exports = exports['default'];
