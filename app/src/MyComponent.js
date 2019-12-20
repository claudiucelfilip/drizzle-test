import React, { useCallback, useEffect } from "react";

import axios from "axios";
import logo from "./logo.png";

export default ({ counter = 0, set, fetch, todos = [], fetchTodos }) => {
  const increaseCounter = useCallback(async () => {
    set(++counter);
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
        <button onClick={increaseCounter}>Increase Counter</button>
        {todos.map(todo => (
          <p key={todo.id}>{todo.title}</p>
        ))}
        <p>storeCounter: {counter}</p>
      </div>
    </div>
  );
};
