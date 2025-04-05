// src/store.js
import { createStore } from 'redux';

// Example reducer (you can replace this with your own)
const rootReducer = (state = { message: 'Hello, Redux!' }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Create the store
const store = createStore(rootReducer);

export default store;
