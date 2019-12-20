import { takeEvery, call, put, takeLatest, select } from "redux-saga/effects";
import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });
let websocket;
wss.on("connection", function connection(ws) {
  websocket = ws;
  websocket.on("error", () => {});
});


// fetch data from service using sagas
function* syncState() {
  const state = yield select();
  console.log("state", state.contracts.SimpleStorage.storedData);
  //   const state = drizzle.store.getState();
  if (!websocket) {
    console.log("no socket");
    return;
  }
  websocket.send(
    JSON.stringify({
      contracts: state.contracts
    })
  );
}

function* testSaga() {
  yield takeLatest("CONTRACT_SYNCED", syncState);
}

export default testSaga;
