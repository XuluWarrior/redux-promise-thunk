const Immutable = require('immutable');

import {START, COMPLETED, FAILED} from '../steps';

export const AsyncActionState = {
  INITIAL: 'INITIAL',
  UPDATING: 'UPDATING',
  UPDATED: 'UPDATED',
  ERROR: 'ERROR'
};

export const AsyncActionStatusRecord = new Immutable.Record({
  status: AsyncActionState.INITIAL,
  data: null,
  lastSuccessfulUpdateTime: null,
  updateTime: null,
  error: null
}, 'AsyncActionStatusRecord');

export function reduceAsyncAction(state, action, storePath) {
  const actionStatusMap = state.getIn(storePath) || new AsyncActionStatusRecord();
  switch (action.meta.asyncStep) {
  case START:
    return state.setIn(storePath, actionStatusMap.merge({
      status: AsyncActionState.UPDATING,
      updateTime: new Date()
    }));
  case COMPLETED:
    const successfulUpdateTime = new Date();
    return state.setIn(storePath, new AsyncActionStatusRecord({
      status: AsyncActionState.UPDATED,
      data: action.payload,
      lastSuccessfulUpdateTime: successfulUpdateTime,
      updateTime: successfulUpdateTime,
      error: null
    }));
  case FAILED:
    return state.setIn(storePath, actionStatusMap.merge({
      status: AsyncActionState.ERROR,
      error: action.payload
    }));
  default:
    return state;
  }
}

export function actionCompletedSuccessfully(actionResult) {
  return actionResult && actionResult.status === AsyncActionState.UPDATED;
}

export function actionIsPending(actionResult) {
  return actionResult && actionResult.status === AsyncActionState.UPDATING;
}

export function actionError(actionResult) {
  return actionResult && actionResult.status === AsyncActionState.ERROR ? actionResult.error : null;
}
