import helpers from './helpers';
import {START, COMPLETED, FAILED, steps, setupSteps} from './steps';

function createPromiseThunk(type, promiseCreator, metaCreator) {

  const typeMap = getTypeMap(type);
  const getType = step => typeMap[step];
  const getMeta = isFunction(metaCreator) ? metaCreator : getMetaByStep(metaCreator);

  function createActionForStep(step, payload) {
    return createAction(getType(step), payload, getMeta(step, type));
  }

  return data => (dispatch, getState) => {
    dispatch(createActionForStep(START, data));

    const promise = promiseCreator.call(this, data, dispatch, getState);

    if (promise && promise.then) {
      return promise.then((result)=>{
        dispatch(createActionForStep(COMPLETED, result));
        return result;
      }, (err)=>{
        dispatch(createActionForStep(FAILED, err));
        throw err;
      });
    } else {
      throw new TypeError('The return of promiseCreator must be a promise object');
    }
  };
}

const isArray = Array.isArray;//todo: polyfill
const isFunction = target => typeof target === 'function';

const getDefaultTypeByStep = type => step => `${type}_${steps[step]}`;

const getTypeMap = type => {
  if (isArray(type)) {
    const [startType, completedType, failedType] = type;

    return {
      [START]: startType,
      [COMPLETED]: completedType,
      [FAILED]: failedType
    }
  } else {
    return {
      [START]: getDefaultTypeByStep(type)(START),
      [COMPLETED]: getDefaultTypeByStep(type)(COMPLETED),
      [FAILED]: getDefaultTypeByStep(type)(FAILED)
    };
  }
};

const getMetaByStep = meta => (step, type) => ({asyncType: type, asyncStep: step, ...meta});

function createAction(type, payload, meta) {
  const action = {
    type,
    payload,
    meta
  };

  if (payload instanceof Error) {
    action.error = true;
  }

  return action;
}

module.exports = {
    createPromiseThunk,
    setupSteps,
    steps,
    helpers
};

export default module.exports;
