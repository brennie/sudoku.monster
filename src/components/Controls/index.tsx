import * as React from "react";
import { connect } from "react-redux";
import { ActionCreators as undoActions } from "redux-undo";

import {
  Dialog,
  DialogButtons,
  DialogContent,
  DialogButton,
} from "sudoku.monster/components/Dialog";
import { State } from "sudoku.monster/ducks";
import { Mode, actions as uiActions } from "sudoku.monster/ducks/ui";
import {
  actions as sudokuActions,
  PencilMarkKind,
} from "sudoku.monster/ducks/sudoku";
import { Value } from "sudoku.monster/sudoku";
import * as styles from "./style.pcss";

interface StateProps {
  dragging: boolean;
  mode: Mode;
  resetDialogShown: boolean;
}

type Props = StateProps & {
  clearHistory: () => void;
  newPuzzle: () => void;
  redo: () => void;
  reset: () => void;
  showResetDialog: (show: boolean) => void;
  setMode: (mode: Mode) => void;
  setCells: (value: Value | null) => void;
  togglePencilMarks: (kind: PencilMarkKind, value: Value | null) => void;
  undo: () => void;
};

const Controls = ({
  clearHistory,
  dragging,
  mode,
  newPuzzle,
  redo,
  reset,
  resetDialogShown,
  setCells,
  setMode,
  showResetDialog,
  togglePencilMarks,
  undo,
}: Props): JSX.Element => {
  const buttonStyle = styles["controls__button"];
  const valueStyle = styles["controls__button--value"];

  let modeStyle;
  let valueAction: (value: Value | null) => void;
  switch (mode) {
    case Mode.Normal:
      modeStyle = styles["controls__button--mode-normal"];
      valueAction = setCells;
      break;

    case Mode.Corner:
      modeStyle = styles["controls__button--mode-corner"];
      valueAction = togglePencilMarks.bind(undefined, PencilMarkKind.Corner);
      break;

    case Mode.Centre:
      modeStyle = styles["controls__button--mode-centre"];
      valueAction = togglePencilMarks.bind(undefined, PencilMarkKind.Centre);
      break;
  }

  const dialog = resetDialogShown ? (
    <Dialog title="Reset?" close={(): void => showResetDialog(false)}>
      <DialogContent>All progress will be lost!</DialogContent>

      <DialogButtons>
        <DialogButton onClick={reset}>Reset</DialogButton>
      </DialogButtons>
    </Dialog>
  ) : (
    undefined
  );

  return (
    <>
      <div
        className={styles["controls"]}
        onMouseUp={(e): void => {
          if (!dragging) {
            e.stopPropagation();
          }
        }}
      >
        <button
          className={`${buttonStyle} ${modeStyle} ${styles["controls__button--normal"]}`}
          onClick={(): void => setMode(Mode.Normal)}
        >
          Normal
        </button>
        <button
          className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-1"]}`}
          onClick={(): void => valueAction(1)}
        />
        <button
          className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-2"]}`}
          onClick={(): void => valueAction(2)}
        />
        <button
          className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-3"]}`}
          onClick={(): void => valueAction(3)}
        />
        <button
          className={`${buttonStyle} ${modeStyle} ${styles["controls__button--corner"]}`}
          onClick={(): void => setMode(Mode.Corner)}
        >
          Corner
        </button>
        <button
          className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-4"]}`}
          onClick={(): void => valueAction(4)}
        />
        <button
          className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-5"]}`}
          onClick={(): void => valueAction(5)}
        />
        <button
          className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-6"]}`}
          onClick={(): void => valueAction(6)}
        />
        <button
          className={`${buttonStyle} ${modeStyle} ${styles["controls__button--centre"]}`}
          onClick={(): void => setMode(Mode.Centre)}
        >
          Centre
        </button>
        <button
          className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-7"]}`}
          onClick={(): void => valueAction(7)}
        />
        <button
          className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-8"]}`}
          onClick={(): void => valueAction(8)}
        />
        <button
          className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-9"]}`}
          onClick={(): void => valueAction(9)}
        />
        <button
          className={`${buttonStyle} ${modeStyle} ${styles["controls__button--delete"]}`}
          onClick={(): void => valueAction(null)}
        >
          Delete
        </button>
        <div className={styles["controls__bottom"]}>
          <button className={buttonStyle} onClick={(): void => undo()}>
            Undo
          </button>
          <button className={buttonStyle} onClick={(): void => redo()}>
            Redo
          </button>
          <button
            className={buttonStyle}
            onClick={(): void => {
              showResetDialog(true);
            }}
          >
            Restart
          </button>
          <button className={buttonStyle}>Check</button>
          <button
            className={`${buttonStyle} ${styles["controls__button--new"]}`}
            onClick={(): void => {
              clearHistory();
              newPuzzle();
            }}
          >
            New Puzzle
          </button>
        </div>
      </div>
      {dialog}
    </>
  );
};

const mapStateToProps = (state: State): StateProps => ({
  dragging: state.sudoku.present.dragging,
  mode: state.ui.mode,
  resetDialogShown: state.ui.resetDialogShown,
});

const mapDispatchToProps = {
  clearHistory: undoActions.clearHistory,
  newPuzzle: sudokuActions.newPuzzle,
  redo: undoActions.redo,
  reset: sudokuActions.reset,
  showResetDialog: uiActions.showResetDialog,
  setMode: uiActions.setMode,
  setCells: sudokuActions.setCells,
  togglePencilMarks: sudokuActions.togglePencilMarks,
  undo: undoActions.undo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Controls);
