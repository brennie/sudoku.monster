import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import SudokuMonster from "sudoku.monster/components/SudokuMonster";
import { createStore } from "sudoku.monster/ducks";
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
