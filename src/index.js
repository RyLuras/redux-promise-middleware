const isPromise = action => {
  if(typeof action.then !== 'function') {
    return false;
  } else {
    return true;
  }
};

export default store => next => action => {
  if(!action.payload || !isPromise(action.payload)) return next(action);

  store.dispatch({ type: 'LOAD_START' });

  return action.payload
    .then(res => {
      next({ type: action.type, payload: res });
      return store.dispatch({ type: 'LOAD_END' });
    })
    .catch(error => {
      store.dispatch({ type: 'LOAD_END' });
      store.dispatch({ type: 'ERROR', payload: error });
    });
};
