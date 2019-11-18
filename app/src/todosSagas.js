import { takeEvery, call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
// fetch data from service using sagas
function* fetchTodos() {
  // yield call(() => console.log("FETCH"));
  console.log("fetching todos");
  const todos = yield axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  ).then(resp => resp.data.slice(0, 3));
  yield put({ type: "TODOS_RECEIVED", todos });
}


function* testSaga() {
  yield takeEvery("FETCH_TODOS", fetchTodos);
  // yield takeEvery("TEST", test);
}

export default testSaga;
