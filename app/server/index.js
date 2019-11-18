import express from "express";
import cors from "cors";
import syncSagas from "./syncSagas";
import drizzleOptions from "../src/drizzleOptions";
import { generateStore, Drizzle, EventActions } from "@drizzle/store";
import bodyParser from "body-parser";

const app = express();
const port = 9000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app Reducers and Sagas
const todosReducer = (state = [], action) => {

  return state;
};
const appReducers = { todos: todosReducer };
const appSagas = [syncSagas];

const store = generateStore({
  drizzleOptions,
  appReducers,
  appSagas
});

const drizzle = new Drizzle(drizzleOptions, store);

app.post("/fetch", (req, res) => {
  drizzle.contracts.SimpleStorage.methods.storedData.cacheCall();
  drizzle.store.dispatch({
    type: "CONTRACT_SYNCED",
    contractName: "SimpleStorage"
  });

  res.sendStatus(200);
});

app.post("/set", (req, res) => {
  const { counter } = req.body;
  drizzle.contracts.SimpleStorage.methods.set.cacheSend(counter);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
