import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import reducer from "sudoku.monster/components/Sudoku/ducks";
import SudokuMonster from "sudoku.monster/components/SudokuMonster";
import "./index.pcss";

window.addEventListener("load", () => {
  const container = document.getElementById("content");
  const store = createStore(reducer, undefined, composeWithDevTools());

  render(
    <Provider store={store}>
      <SudokuMonster />
    </Provider>,
    container,
  );
});
