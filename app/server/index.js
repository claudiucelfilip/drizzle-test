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

const appSagas = [syncSagas];

const store = generateStore({
  drizzleOptions,
  appSagas
  // appMiddlewares: [contractEventNotifier]
});

const drizzle = new Drizzle(drizzleOptions, store);

app.get("/", (req, res) => {});

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

let counter = 100;
app.get("/getData", (req, res) => {
  // Assuming we're observing the store for changes.
  const state = drizzle.store.getState();
  // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
  if (!state.drizzleStatus.initialized) {
    // Declare this call to be cached and synchronized. We'll receive the store key for recall.
    // If Drizzle isn't initialized, display some loading indication.
    res.send("Loading...");
    return;
  }
  drizzle.contracts.SimpleStorage.methods.set.cacheSend(counter++);
  const dataKey = drizzle.contracts.SimpleStorage.methods.storedData.cacheCall();

  // Use the dataKey to display data from the store.
  res.send(state.contracts.SimpleStorage.storedData[dataKey].value);
  // res.send("OK");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
