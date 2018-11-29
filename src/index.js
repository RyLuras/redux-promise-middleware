const isPromise = action => {
  if(typeof action.then !== 'function') {
    return false;
  } else {
    return true;
  }
};

export const LOAD_START = 'LOAD_START';
export const LOAD_END = 'LOAD_END';
export const PROMISE_ERROR = 'PROMISE_ERROR';

export default store => next => action => {
  const { type, payload } = action;
  if(!payload || !isPromise(payload)) return next(action);

  store.dispatch({ type: LOAD_START });

  return payload
    .then(res => {
      next({ type: type, payload: res });
      return store.dispatch({ type: LOAD_END });
    })
    .catch(error => {
      store.dispatch({ type: LOAD_END });
      return store.dispatch({ type: PROMISE_ERROR, payload: error });
    });
};
