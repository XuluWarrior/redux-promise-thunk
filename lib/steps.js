'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _steps;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var START = 'START';
exports.START = START;
var COMPLETED = 'COMPLETED';
exports.COMPLETED = COMPLETED;
var FAILED = 'FAILED';

exports.FAILED = FAILED;
var steps = (_steps = {}, _defineProperty(_steps, START, 'START'), _defineProperty(_steps, COMPLETED, 'COMPLETED'), _defineProperty(_steps, FAILED, 'FAILED'), _steps);

exports.steps = steps;
var setupSteps = function setupSteps(customSteps) {
    return exports.steps = steps = _extends({ steps: steps }, customSteps);
};
exports.setupSteps = setupSteps;