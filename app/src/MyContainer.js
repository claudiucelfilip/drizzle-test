import MyComponent from "./MyComponent";
import { connect } from "react-redux";

const set = counter => {
  return { type: "set", counter };
};
const fetch = () => {
  return { type: "fetch" };
};

const fetchTodos = () => {
  return { type: "todos_fetch" };
};

const mapStateToProps = state => {
  let counter;
  try {
    counter = state.contracts.SimpleStorage.storedData["0x0"].value;
    counter = parseInt(counter);
  } catch (_) {}

  return {
    counter,
    todos: state.todos
  };
};

const mapDispatchToProps = { set, fetch, fetchTodos };

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
