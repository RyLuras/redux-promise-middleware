const isPromise = action => {
  if(typeof action.then !== 'function') {
    return false;
  } else {
    return true;
  }
};

export default store => next => action => {
  if(!isPromise(action.payload)) return next(action);

  store.dispatch({ type: 'LOAD_START' });

  action.payload
    .then(res => {
      store.disparch({ type: action.type, payload: res });
      return store.dispatch({ type: 'LOAD_END' });
    })
    .catch(err => {
      store.dispatch({ type: 'LOAD_END' });
      return store.disparch({ type: 'ERROR', payload: err });
    });
};
