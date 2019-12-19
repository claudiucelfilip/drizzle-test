This is a PoC which aims to demonstrate the viability of using drizzle development of dapp on Ethereum.


### TL;DR
As a summary, there's a node server which uses drizzle to interact with a smart contract. 
In turn, a client app is setup to interact with both the node server and an external API.

The idea is that drizzle can be used to manage a limited, smart contract state on a server and redux+saga for everything else on the frontend. 
Alternatively, the smart contract state can be manage on the frontend with the same drizzle library and the external state manangement can be added to drizzle.


## Other blockchains with drizzle (ie Wavelet)
For now, to avoid unnecesarry bugs, Wavelet integration is not included in this project.
A local Ethereum network is used (via Ganache) with minimal changes to drizzle https://github.com/claudiucelfilip/drizzle/tree/feature/node-support.

Please consult https://github.com/claudiucelfilip/drizzle/tree/feature/wavelet-integration for Wavelet integration.

## Drizzle on the server side

app/server/index.js opens two servers:

### 1. Express on port 9000

This server exposes 2 POST enpoints:

- `/fetch`
   - calls a drizzle wrapper method `cacheCall` which is wrapper over web3.js function `call`. In our case, there's a `storedData` variable (getter) on the smart contract and we call it to get the latest counter value.
   - triggers `CONTRACT_SYNCED` which then sends the updated state via WebSocket. Could have just returned the state here but opted to use a single channel for state sync (via websocket)
- `/set`
   - calls a drizzle wrapper method `cacheSend` hich is wrapper over web3.js function `send`. In our case, this will update the `storedData` with the latest counter value.

Normally, a general purpose dispatch endpoint can be used and smart contract calls can abstracted and mapped to each action.

### WebSocket on port 8080

The WebSocket server listens to any `CONTRACT_SYNCED` actions, is dispatched by drizzle and sends all the contract state to the client.

## 3. Client state outside drizzle
In order to interact with the servers app/src/sagas.js is used. It listens to 3 actions and creates a eventChannel:
- `fetch`  maps to POST `/fetch`
- `set`  maps to POST `/set`
- `todos_fetch` calls external [jsonplaceholder API](https://jsonplaceholder.typicode.com/todos) and dispatches an action to update the todos
- `eventChannel` to listen for state updates from WebSocket and dispatches an action to replace the whole state.

Should we use drizzle on the client, extra actions/reducers/states cand be added along sided the other smart contract functionality.

# Usage

1. Run Truffle + Ganache
In root folder run `truffle develop`
From the consle run `compile` and then `deploy`

2. [New Terminal] Install Node dependencies 
`cd app && yarn`
  
   - Notice: a custom, packed version of @drizzle/store is used from the [node-support](https://github.com/claudiucelfilip/drizzle/tree/feature/node-support) branch

1. Run Node server
`yarn server`

5. [New Terminal] Run client
`cd app && yarn start`
