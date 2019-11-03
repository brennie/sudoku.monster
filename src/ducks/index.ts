import { Store, combineReducers, createStore as createReduxStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import sudokuReducer, * as sudoku from "sudoku.monster/ducks/sudoku";
import uiReducer, * as ui from "sudoku.monster/ducks/ui";

export interface State {
  sudoku: sudoku.State;
  ui: ui.State;
}

export type Action = sudoku.Action | ui.Action;

const reducer = combineReducers({
  sudoku: sudokuReducer,
  ui: uiReducer,
});

export function createStore(): Store<State, Action> {
  return createReduxStore(reducer, undefined, composeWithDevTools());
}
