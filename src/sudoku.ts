import { times } from "ramda";

/**
 * The valid value of a Sudoku cell.
 *
 * The `null` value implies an empty cell.
 */
export type Value = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Parse a value from a string.
 */
export const parseValue = (s: string): Value | null => {
  if (s === "") {
    return null;
  }

  const val = parseInt(s);
  if (typeof val === "number" && val >= 1 && val <= 9) {
    return val as Value;
  }

  return null;
};

export interface Sudoku {
  /** The values of individual cells. */
  readonly values: (Value | null)[][];

  /** Pencil marks in the corner of cells. */
  readonly cornerMarks: Value[][][];

  /** Pencil marks in the centre of cells. */
  readonly centreMarks: Value[][][];

  /** The locked state of individual cells. */
  readonly locked: boolean[][];
}

// The current, hardcoded puzzle.
const _puzzle: (Value | null)[][] = [
  [4, null, 3, null, null, 1, 6, 2, null],
  [null, 7, null, null, null, null, null, null, 1],
  [8, 6, 1, 3, null, null, null, null, 5],
  [null, null, 4, null, 3, null, null, null, 9],
  [null, 3, 8, 9, null, 7, 2, 4, null],
  [2, null, null, null, 5, null, 1, null, null],
  [7, null, null, null, null, 3, 9, 1, 2],
  [3, null, null, null, null, null, null, 6, null],
  [null, 4, 9, 7, null, null, 8, null, 3],
];

/**
 * Transform a grid of values into a Sudoku.
 */
const toSudoku = (puzzle: (Value | null)[][]): Sudoku => {
  const values = puzzle.map(row => row.map(value => value));
  const locked = puzzle.map(row => row.map(value => value !== null));

  return {
    values,
    locked,
    centreMarks: times(() => times(() => [], 9), 9),
    cornerMarks: times(() => times(() => [], 9), 9),
  };
};

export const newSudoku = (): Sudoku => {
  // TODO: Generate puzzles.
  return toSudoku(_puzzle);
};
