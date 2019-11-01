import { combineReducers, Reducer, createStore as createReduxStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import sudoku, * as Sudoku from "./components/Sudoku/ducks.ts";
import controls, * as Controls from "./components/Controls/ducks.ts";

export type Action = Sudoku.Action | Controls.Action;

export interface State {
  controls: Controls.State;
  sudoku: Sudoku.State;
}

const reducer: Reducer<State, Action> = combineReducers({
  controls,
  sudoku,
});


export const createStore = () => createReduxStore(reducer, undefined, composeWithDevTools());
