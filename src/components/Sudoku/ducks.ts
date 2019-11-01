import { repeat, times } from "ramda";

import { Sudoku, Value, newSudoku } from "../../sudoku.ts";
import { clone2D, update2D } from "../../utils.ts";

const CLEAR_FOCUS = "sudoku.monster/sudoku/CLEAR_FOCUS";
const FOCUS_CELL = "sudoku.monster/sudoku/FOCUS_CELL";
const SET_CELLS = "sudoku.monster/sudoku/SET_CELLS";
const SET_DRAGGING = "sudoku.monster/sudoku/SET_DRAGGING";

export interface ClearFocusAction {
  type: "sudoku.monster/sudoku/CLEAR_FOCUS";
}

const clearFocus = (): ClearFocusAction => ({
  type: CLEAR_FOCUS,
});

export interface FocusCellAction {
  type: "sudoku.monster/sudoku/FOCUS_CELL";
  payload: {
    x: number;
    y: number;
    union: boolean;
  };
}

const focusCell = (x: number, y: number, union: boolean): FocusCellAction => ({
  type: FOCUS_CELL,
  payload: {
    x,
    y,
    union,
  },
});

export interface SetCellsAction {
  type: "sudoku.monster/sudoku/SET_CELLS";
  payload: {
    value: Value;
  };
}

const setCells = (value: Value): SetCellsAction => ({
  type: SET_CELLS,
  payload: {
    value,
  },
});

interface SetDraggingAction {
  type: "sudoku.monster/sudoku/SET_DRAGGING";
  payload: {
    dragging: boolean;
  };
}

const setDragging = (dragging: boolean): SetDraggingAction => ({
  type: SET_DRAGGING,
  payload: {
    dragging,
  },
});

export const actions = {
  clearFocus,
  focusCell,
  setCells,
  setDragging,
};

export type Action =
  | ClearFocusAction
  | FocusCellAction
  | SetCellsAction
  | SetDraggingAction;

export interface State {
  puzzle: Sudoku;
  focused: boolean[][];
  dragging: boolean;
}

const newFocus = (): boolean[][] => times(() => repeat(false, 9), 9);

const defaultState = {
  puzzle: newSudoku(),
  focused: newFocus(),
  dragging: false,
};

export default (state: State = defaultState, action: Action): State => {
  switch (action.type) {
    case CLEAR_FOCUS:
      return {
        ...state,
        focused: newFocus(),
      };

    case FOCUS_CELL: {
      const { x, y, union } = action.payload;

      let focused;
      if (union) {
        focused = update2D(state.focused, x, y, true);
      } else {
        (focused = newFocus()), (focused[y][x] = true);
      }

      return {
        ...state,
        focused: update2D(focused, x, y, true),
      };
    }

    case SET_CELLS: {
      const { value } = action.payload;
      const { focused, puzzle } = state;

      const cells = focused.reduce(
        (cells, row, y) =>
          row.reduce((cells, isFocused, x) => {
            if (isFocused && !puzzle.locked[y][x]) {
              cells.push({ x, y });
            }

            return cells;
          }, cells),
        [] as { x: number; y: number }[],
      );

      let values;
      if (cells.length === 1) {
        const { x, y } = cells[0];
        values = update2D(puzzle.values, x, y, value);
      } else {
        values = clone2D(puzzle.values);
        for (const { x, y } of cells) {
          values[y][x] = value;
        }
      }

      return {
        ...state,
        puzzle: {
          ...puzzle,
          values,
        },
      };
    }

    case SET_DRAGGING:
      return {
        ...state,
        dragging: action.payload.dragging,
      };

    default:
      return state;
  }
};
