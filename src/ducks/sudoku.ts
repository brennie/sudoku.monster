import { repeat, times } from "ramda";
import undoable, { includeAction, StateWithHistory } from "redux-undo";

import { Sudoku, Value, newSudoku } from "sudoku.monster/sudoku";
import { clone2D, update2D } from "sudoku.monster/utils";

const CLEAR_FOCUS = "sudoku.monster/sudoku/CLEAR_FOCUS";
const FOCUS_CELL = "sudoku.monster/sudoku/FOCUS_CELL";
const NEW_PUZZLE = "sudoku.monster/sudoku/NEW_PUZZLE";
const RESET = "sudoku.monster/sudoku/RESET";
const SET_CELLS = "sudoku.monster/sudoku/SET_CELLS";
const SET_DRAGGING = "sudoku.monster/sudoku/SET_DRAGGING";
const TOGGLE_PENCIL_MARKS = "sudoku.monster/sudoku/TOGGLE_PENCIL_MARKS";

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

interface NewPuzzleAction {
  type: "sudoku.monster/sudoku/NEW_PUZZLE";
}

const newPuzzle = (): NewPuzzleAction => ({
  type: NEW_PUZZLE,
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
    value: Value | null;
  };
}

const setCells = (value: Value | null): SetCellsAction => ({
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

export enum PencilMarkKind {
  Centre = "center",
  Corner = "corner",
}

interface TogglePencilMarksAction {
  type: "sudoku.monster/sudoku/TOGGLE_PENCIL_MARKS";
  payload: {
    kind: PencilMarkKind;
    value: Value | null;
  };
}

const togglePencilMarks = (
  kind: PencilMarkKind,
  value: Value | null,
): TogglePencilMarksAction => ({
  type: TOGGLE_PENCIL_MARKS,
  payload: {
    kind,
    value,
  },
});

export const actions = {
  clearFocus,
  focusCell,
  newPuzzle,
  reset,
  setCells,
  setDragging,
  togglePencilMarks,
};

export type Action =
  | ClearFocusAction
  | FocusCellAction
  | NewPuzzleAction
  | ResetAction
  | SetCellsAction
  | SetDraggingAction
  | TogglePencilMarksAction;

interface InnerState {
  puzzle: Sudoku;
  focused: boolean[][];
  dragging: boolean;
}

export type State = StateWithHistory<InnerState>;

const newFocus = (): boolean[][] => times(() => repeat(false, 9), 9);

const defaultState = {
  puzzle: newSudoku(),
  focused: newFocus(),
  dragging: false,
};

interface Cell {
  x: number;
  y: number;
}

const getFocusedCells = ({ focused, puzzle }: InnerState): Cell[] =>
  focused.reduce(
    (cells, row, y) =>
      row.reduce((cells, isFocused, x) => {
        if (isFocused && !puzzle.locked[y][x]) {
          cells.push({ x, y });
        }

        return cells;
      }, cells),
    [] as { x: number; y: number }[],
  );

const toggleValue = (values: Value[], value: Value | null): Value[] => {
  if (value === null) {
    return [];
  }

  const newValues = values.slice();
  let i = values.indexOf(value);
  if (i !== -1) {
    newValues.splice(i, 1);
  } else {
    for (i = 0; i < values.length; i++) {
      if (values[i] > value) {
        break;
      }
    }
    newValues.splice(i, 0, value);
  }

  return newValues;
};

const reducer = (
  state: InnerState = defaultState,
  action: Action,
): InnerState => {
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

    case NEW_PUZZLE:
      return {
        ...state,
        dragging: false,
        focused: newFocus(),
        puzzle: newSudoku(),
      };

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
        dragging: false,
        focused: newFocus(),
        puzzle: {
          ...puzzle,
          values,
        },
      };
    }

    case SET_CELLS: {
      const { value } = action.payload;
      const { puzzle } = state;

      const cells = getFocusedCells(state);

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

    case TOGGLE_PENCIL_MARKS: {
      const { puzzle } = state;
      const { kind, value } = action.payload;
      const cells = getFocusedCells(state);

      const newPuzzle = {
        ...puzzle,
      };

      let toUpdate;
      if (kind === PencilMarkKind.Centre) {
        toUpdate = newPuzzle.centreMarks = clone2D(newPuzzle.centreMarks);
      } else {
        toUpdate = newPuzzle.cornerMarks = clone2D(newPuzzle.cornerMarks);
      }

      for (const { x, y } of cells) {
        toUpdate[y][x] = toggleValue(toUpdate[y][x], value);
      }

      return {
        ...state,
        puzzle: newPuzzle,
      };
    }

    default:
      return state;
  }
};

export default undoable(reducer, {
  filter: includeAction([SET_CELLS, TOGGLE_PENCIL_MARKS]),
});
