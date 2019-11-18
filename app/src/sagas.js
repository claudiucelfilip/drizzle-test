import { takeLatest, call, take, put } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import axios from "axios";

function sync() {
  return eventChannel(emit => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      emit({ type: "fetch" });
    };

    ws.onmessage = message => {
      const data = JSON.parse(message.data);
      emit({ type: "set_state", data });
    };

    // The subscriber must return an unsubscribe function
    return () => {
      ws.close();
      emit(END);
    };
  });
}

function* fetchTodos() {
  // yield call(() => console.log("FETCH"));
  console.log("fetching todos");
  const todos = yield axios
    .get("https://jsonplaceholder.typicode.com/todos")
    .then(resp => resp.data.slice(0, 3));
  yield put({ type: "todos_received", todos });
}

function* set(action) {
  const { type, ...payload } = action;
  const result = yield axios.post(`http://localhost:9000/${type}`, payload);
  console.log(result);
}

export default function* mySagas() {
  yield takeLatest("fetch", set);
  yield takeLatest("set", set);
  yield takeLatest("todos_fetch", fetchTodos);
  const chan = yield call(sync);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      let action = yield take(chan);
      yield put(action);
    }
  } finally {
    console.log("countdown terminated");
  }
}
