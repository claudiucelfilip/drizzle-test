This project was build on top of https://github.com/truffle-box/drizzle-box and it only uses the SimpleStorage.sol smart contract.


### TL;DR
Project consists of:
- `node server` which interacts with a smart contract using drizzle. 
- `client app`  to interact with both the node server and another API.

The idea is that drizzle can be used to manage a limited, smart contract state on a server and redux+saga for everything else on the frontend. 
Alternatively, the smart contract's state can also be manage on the frontend with the same drizzle library but that'll require that the user manage their own privateKey (Metamask or hardware wallet).


## Other blockchains with drizzle (ie Wavelet)
For now, to avoid unnecesarry bugs, Wavelet integration is not included in this project.
A local Ethereum network is used (via Ganache) with minimal changes to drizzle https://github.com/claudiucelfilip/drizzle/tree/feature/node-support.

Please consult https://github.com/claudiucelfilip/drizzle/tree/feature/wavelet-integration for Wavelet integration.

## Drizzle on the server side
The node server actually runs a simple express server and a WebSocket server:

### 1. Express on port 9000

This server exposes 2 POST enpoints:

- `/fetch`
   - calls a drizzle method `cacheCall` which is wraps over web3.js function `call`. In our case, there's a `storedData` variable (getter) on the smart contract and we call it to get the latest counter value.
   - triggers `CONTRACT_SYNCED` which sends the updated state to the client via WebSocket. Could have just returned the state as response here but opted for a single channel for state sync (via WebSocket)
- `/set`
   - calls a drizzle wrapper method `cacheSend` hich is wrapper over web3.js function `send`. In our case, this will update the `storedData` with the latest counter value.

Normally, a generic dispatch endpoint can be used to proxy any of type actions.

### WebSocket on port 8080

The WebSocket server listens to any `CONTRACT_SYNCED` action and sends the contract state to the client.

## 3. Client state outside drizzle
Custom sagas are used to interact with the node server (express and weboscket):
- `fetch`  maps to POST `/fetch`
- `set`  maps to POST `/set`
- `todos_fetch` calls external API [jsonplaceholder API](https://jsonplaceholder.typicode.com/todos) and dispatches an action to update the todos list
- `eventChannel` listens for state updates from WebSocket and dispatches an action to replace the whole state.

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
