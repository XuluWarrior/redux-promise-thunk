// TODO: Implement helper using basic objects

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var helpers = {
  immutable: 'Install immutable to enable immutable helper'
};

try {
  var immutableLib = require('immutable');
  helpers.immutable = require('./immutable');
} catch (e) {}

exports['default'] = helpers;
module.exports = exports['default'];