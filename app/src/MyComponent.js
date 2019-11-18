import React, { useCallback, useEffect } from "react";

import axios from "axios";
import logo from "./logo.png";

let counter = 200;
export default ({ counter = 0, set, fetch, todos = [], fetchTodos }) => {
  const count = useCallback(async () => {
    set(counter + 1);
  }, [counter]);

  return (
    <div className="App">
      <div>
        <img src={logo} alt="drizzle-logo" />
        <h1>Drizzle Examples</h1>
        <p>
          Examples of how to get started with Drizzle in various situations.
        </p>
        <button onClick={fetchTodos}>Fetch Todos</button>
        <button onClick={fetch}>Fetch</button>
        <button onClick={count}>Count</button>
        {todos.map(todo => (
          <p key={todo.id}>{todo.title}</p>
        ))}
        <p>storeCounter: {counter}</p>
      </div>
    </div>
  );
};
