import { promiseMiddleware } from './index.js';
import { createStore, applyMiddleware } from 'redux';

describe('promise middleware', () => {

  const reducer = jest.fn(state => state);
  const store = createStore(reducer, {}, applyMiddleware(promiseMiddleware));

  it('tests a successful promise', () => {

    const promise = Promise.resolve('SOMETHING');

    store.dispatch({
      type: 'PROMISE_ACTION',
      payload: promise
    });

    return promise.then(() => {
      expect(reducer.mock.calls).toContain({ type: 'PROMISE_ACTION', payload: 'SOMETHING' });
    });

  });

});
