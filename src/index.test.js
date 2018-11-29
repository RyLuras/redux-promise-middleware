import promiseMiddleware from './index.js';
import { createStore, applyMiddleware } from 'redux';

describe('promise middleware', () => {
  it('tests a successful promise', () => {
    const reducer = jest.fn(state => state);
    const store = createStore(reducer, {}, applyMiddleware(promiseMiddleware));

    const promise = Promise.resolve('SOMETHING');

    store.dispatch({
      type: 'PROMISE_ACTION',
      payload: promise
    });

    return promise.then(() => {
      expect(reducer.mock.calls[1][1]).toEqual({ type: 'LOAD_START' });
      expect(reducer.mock.calls[2][1]).toEqual({
        type: 'PROMISE_ACTION',
        payload: 'SOMETHING'
      });
      expect(reducer.mock.calls[3][1]).toEqual({ type: 'LOAD_END' });
    });
  });

  it('rests a unsuccessful promise', () => {
    const reducer = jest.fn(state => state);
    const store = createStore(reducer, {}, applyMiddleware(promiseMiddleware));
    const next = jest.fn();
    const promise = Promise.reject('ERROR');
    const action = { type: 'PROMISE_ACTION', payload: promise };

    return promiseMiddleware(store)(next)(action).finally(() => {
      expect(reducer.mock.calls[2][1]).toEqual({ type: 'LOAD_END' });
      expect(reducer.mock.calls[3][1]).toEqual({
        payload: 'ERROR',
        type: 'PROMISE_ERROR'
      });
    });
  });
});
