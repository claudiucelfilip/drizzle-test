import React, { Component } from "react";
import { Provider } from "react-redux";
import "./App.css";
import MyContainer from "./MyContainer";
import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import sagas from "./sagas";
// actions

// // reducers
// const appReducer = (state = {}, action) => {

//   if (action.type === "SET_STATE") {
//     return {
//       ...state,
//       ...action.state
//     };
//   }

//   return state;
// };

const reducers = (state = {}, action) => {
  if (action.type === "todos_received") {
    return {
      ...state,
      todos: action.todos
    };
  }
  if (action.type === "set_state") {
    return {
      ...state,
      ...action.data
    };
  }
  return state;
};

// // app Reducers and Sagas

// const appSagas = [appRootSaga];

// const store = generateStore({
//   drizzleOptions,
//   appReducers,
//   appSagas
// });

// const drizzle = new Drizzle(drizzleOptions);

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(sagas);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MyContainer />
      </Provider>
    );
  }
}

export default App;
