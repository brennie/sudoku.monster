import { Store, combineReducers, createStore as createReduxStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import sudokuReducer, * as sudoku from "sudoku.monster/ducks/sudoku";

export interface State {
  sudoku: sudoku.State;
}

export type Action = sudoku.Action;

const reducer = combineReducers({
  sudoku: sudokuReducer,
});

export function createStore(): Store<State, Action> {
  return createReduxStore(reducer, undefined, composeWithDevTools());
}
