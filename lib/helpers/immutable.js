'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AsyncActionStatusRecord = exports.AsyncActionState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.reduceAsyncAction = reduceAsyncAction;
exports.actionCompletedSuccessfully = actionCompletedSuccessfully;
exports.actionIsPending = actionIsPending;
exports.actionError = actionError;

var _steps = require('../steps');

var Immutable = require('immutable');

var AsyncActionState = exports.AsyncActionState = {
  INITIAL: 'INITIAL',
  UPDATING: 'UPDATING',
  UPDATED: 'UPDATED',
  ERROR: 'ERROR'
};

var AsyncActionStatusRecord = exports.AsyncActionStatusRecord = new Immutable.Record({
  status: AsyncActionState.INITIAL,
  data: null,
  lastSuccessfulUpdateTime: null,
  updateTime: null,
  error: null
}, 'AsyncActionStatusRecord');

function reduceAsyncAction(state, action, storePath) {
  var actionStatusMap = state.getIn(storePath) || new AsyncActionStatusRecord();
  switch (action.meta.asyncStep) {
    case _steps.START:
      return state.setIn(storePath, actionStatusMap.merge({
        status: AsyncActionState.UPDATING,
        updateTime: new Date()
      }));
    case _steps.COMPLETED:
      var successfulUpdateTime = new Date();
      return state.setIn(storePath, new AsyncActionStatusRecord({
        status: AsyncActionState.UPDATED,
        data: action.payload,
        lastSuccessfulUpdateTime: successfulUpdateTime,
        updateTime: successfulUpdateTime,
        error: null
      }));
    case _steps.FAILED:
      var serialializableError = JSON.parse(JSON.stringify(_extends({
        message: action.payload.message,
        stack: action.payload.stack
      }, action.payload)));
      return state.setIn(storePath, actionStatusMap.merge(new Immutable.Map({
        status: AsyncActionState.ERROR,
        error: serialializableError
      })));
    default:
      return state;
  }
}

function actionCompletedSuccessfully(actionResult) {
  return actionResult && actionResult.status === AsyncActionState.UPDATED;
}

function actionIsPending(actionResult) {
  return actionResult && actionResult.status === AsyncActionState.UPDATING;
}

function actionError(actionResult) {
  return actionResult && actionResult.status === AsyncActionState.ERROR ? actionResult.error : null;
}