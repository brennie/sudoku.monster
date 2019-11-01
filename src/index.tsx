import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import SudokuMonster from "./components/SudokuMonster";
import { createStore} from "./store.ts";
import "./index.pcss";

window.addEventListener("load", () => {
  const container = document.getElementById("content");
  const store = createStore();

  render(
    <Provider store={store}>
      <SudokuMonster />
    </Provider>,
    container,
  );
});
