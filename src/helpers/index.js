// TODO: Implement helper using basic objects

const helpers = {
  immutable: 'Install immutable to enable immutable helper'
};

try {
  const immutableLib = require('immutable');
  helpers.immutable = require('./immutable');
} catch (e) {}


export default helpers;
