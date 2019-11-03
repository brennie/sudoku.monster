import { repeat, times } from "ramda";

import { Sudoku, Value, newSudoku } from "sudoku.monster/sudoku";
import { clone2D, update2D } from "sudoku.monster/utils";

const CLEAR_FOCUS = "sudoku.monster/sudoku/CLEAR_FOCUS";
const FOCUS_CELL = "sudoku.monster/sudoku/FOCUS_CELL";
const RESET = "sudoku.monster/sudoku/RESET";
const SET_CELLS = "sudoku.monster/sudoku/SET_CELLS";
const SET_DRAGGING = "sudoku.monster/sudoku/SET_DRAGGING";

export interface ClearFocusAction {
  type: "sudoku.monster/sudoku/CLEAR_FOCUS";
}

const clearFocus = (): ClearFocusAction => ({
  type: CLEAR_FOCUS,
});

interface FocusCellAction {
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

interface ResetAction {
  type: "sudoku.monster/sudoku/RESET";
}

const reset = (): ResetAction => ({
  type: RESET,
});

interface SetCellsAction {
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
  reset,
  setCells,
  setDragging,
};

export type Action =
  | ClearFocusAction
  | FocusCellAction
  | ResetAction
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

    case RESET: {
      const { puzzle } = state;

      const values = clone2D(puzzle.values);
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          if (!puzzle.locked[y][x]) {
            values[y][x] = null;
          }
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
