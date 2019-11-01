import * as React from "react";
import { connect } from "react-redux";

import { Value } from "../../sudoku.ts";
import { State } from "../../store.ts";
import { actions as sudokuActions } from "../Sudoku/ducks.ts";
import { Mode, actions } from "./ducks.ts";
import * as styles from "./style.pcss";

interface StateProps {
  mode: Mode;
}

type Props = StateProps & {
  setMode: (mode: Mode) => void;
  setCells: (value: Value) => void;
};

type ValueAction = (value: Value) => void;

const Controls = ({mode, setCells, setMode}: Props): JSX.Element => {
  const buttonStyle = styles["controls__button"];
  const valueStyle = styles["controls__button--value"];

  let modeStyle;
  let valueAction: ValueAction = (value: Value): void => void 0;
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

    case Mode.Colour:
      modeStyle = styles["controls__button--mode-colour"];
      break;
  }

  return (
    <div className={styles["controls"]}
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
        onClick={() => valueAction(1)}
      />
      <button
        className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-2"]}`}
        onClick={() => valueAction(2)}
      />
      <button
        className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-3"]}`}
        onClick={() => valueAction(3)}
      />
      <button
        className={`${buttonStyle} ${modeStyle} ${styles["controls__button--corner"]}`}
        onClick={() => setMode(Mode.Corner)}
      >
        Corner
      </button>
      <button
        className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-4"]}`}
        onClick={() => valueAction(4)}
      />
      <button
        className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-5"]}`}
        onClick={() => valueAction(5)}
      />
      <button
        className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-6"]}`}
        onClick={() => valueAction(6)}
      />
      <button
        className={`${buttonStyle} ${modeStyle} ${styles["controls__button--centre"]}`}
        onClick={() => setMode(Mode.Centre)}
      >
        Centre
      </button>
      <button
        className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-7"]}`}
        onClick={() => valueAction(7)}
      />
      <button
        className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-8"]}`}
        onClick={() => valueAction(8)}
      />
      <button
        className={`${buttonStyle} ${modeStyle} ${valueStyle} ${styles["controls__button--value-9"]}`}
        onClick={() => valueAction(9)}
      />
      <button
        className={`${buttonStyle} ${modeStyle} ${styles["controls__button--colour"]}`}
        onClick={() => setMode(Mode.Colour)}
      >
        Colour
      </button>
      <button
        className={`${buttonStyle} ${modeStyle} ${styles["controls__button--delete"]}`}
        onClick={(): void => valueAction(null)}
      >
        Delete
      </button>
      <div className={styles["controls__bottom"]}>
        <button>Undo</button>
        <button>Redo</button>
        <button>Restart</button>
        <button>Check</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State): StateProps => ({
  mode: state.controls.mode,
});

const mapDispatchToProps = {
  setMode: (mode: Mode): ReturnType<typeof actions.setMode> => actions.setMode(mode),
  setCells: (value: Value): ReturnType<typeof sudokuActions.setCells> => sudokuActions.setCells(value),
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
