import * as React from "react";
import { connect } from "react-redux";

import { Value } from "sudoku.monster/sudoku";
import { State } from "sudoku.monster/ducks";
import { actions as sudokuActions } from "sudoku.monster/ducks/sudoku";
import { Mode, actions as uiActions } from "sudoku.monster/ducks/ui";
import * as styles from "./style.pcss";

interface StateProps {
  mode: Mode;
}

type Props = StateProps & {
  setMode: (mode: Mode) => void;
  setCells: (value: Value) => void;
};

type ValueAction = (value: Value) => void;

const Controls = ({ mode, setCells, setMode }: Props): JSX.Element => {
  const buttonStyle = styles["controls__button"];
  const valueStyle = styles["controls__button--value"];

  let modeStyle;
  let valueAction: ValueAction = (): void => void 0;
  switch (mode) {
    case Mode.Normal:
      modeStyle = styles["controls__button--mode-normal"];
      valueAction = setCells;
      break;

    case Mode.Corner:
      modeStyle = styles["controls__button--mode-corner"];
      break;

    case Mode.Centre:
      modeStyle = styles["controls__button--mode-centre"];
      break;
  }

  return (
    <div
      className={styles["controls"]}
      onMouseUp={(e): void => e.stopPropagation()}
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
        <button className={buttonStyle}>Undo</button>
        <button className={buttonStyle}>Redo</button>
        <button className={buttonStyle}>Restart</button>
        <button className={buttonStyle}>Check</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State): StateProps => ({
  mode: state.ui.mode,
});

const mapDispatchToProps = {
  setMode: (mode: Mode): ReturnType<typeof uiActions.setMode> =>
    uiActions.setMode(mode),
  setCells: (value: Value): ReturnType<typeof sudokuActions.setCells> =>
    sudokuActions.setCells(value),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Controls);
