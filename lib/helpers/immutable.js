'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AsyncActionStatusRecord = exports.AsyncActionState = undefined;
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
      return state.setIn(storePath, actionStatusMap.merge(new Immutable.Map({
        status: AsyncActionState.ERROR,
        error: action.payload
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