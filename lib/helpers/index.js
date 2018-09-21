'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// TODO: Implement helper using basic objects

var helpers = {
  immutable: 'Install immutable to enable immutable helper'
};

try {
  var immutableLib = require('immutable');
  helpers.immutable = require('./immutable');
} catch (e) {}

exports.default = helpers;

module.exports = helpers;