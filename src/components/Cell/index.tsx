import * as React from "react";
import { connect } from "react-redux";

import { State } from "sudoku.monster/ducks";
import { actions } from "sudoku.monster/ducks/sudoku";
import { Value } from "sudoku.monster/sudoku";
import * as styles from "./style.pcss";

const isMac = navigator.platform.startsWith("Mac");

interface OwnProps {
  x: number;
  y: number;
}

interface StateProps {
  dragging: boolean;
  focused: boolean;
  locked: boolean;
  value: Value | null;
  centreMarks: Value[];
  cornerMarks: Value[];
}

type Props = OwnProps &
  StateProps & {
    focusCell: (x: number, y: number, union: boolean) => void;
    startDragging: () => void;
  };

const centreMarkStyle = `${styles["cell__mark"]} ${styles["cell__mark--centre"]}`;
const cornerMarkStyle = `${styles["cell__mark"]} ${styles["cell__mark--corner"]}`;

const Cell = ({
  centreMarks,
  cornerMarks,
  dragging,
  focusCell,
  focused,
  locked,
  startDragging,
  value,
  x,
  y,
}: Props): JSX.Element => {
  const classes = [styles["cell"]];
  const inputClasses = [styles["cell__input"]];
  if (focused) {
    classes.push(styles["cell--focused"]);
  }

  let inner;
  if (locked) {
    inner = <div>{value}</div>;
  } else if ((value === null && centreMarks.length) || cornerMarks.length) {
    inner = (
      <div
        className={`${styles["cell__input"]} ${styles["cell__input--marked"]}`}
      >
        <>
          {cornerMarks.map((v, i) => (
            <div className={cornerMarkStyle} key={i}>
              {v}
            </div>
          ))}
        </>
        <div className={centreMarkStyle}>{centreMarks}</div>
      </div>
    );
  } else {
    inner = <div className={styles["cell__input"]}>{value}</div>;
  }

  return (
    <div
      className={classes.join(" ")}
      onMouseDown={(e): void => {
        startDragging();

        if ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) {
          focusCell(x, y, true);
        } else {
          focusCell(x, y, false);
        }
      }}
      onMouseEnter={(): void => {
        if (dragging) {
          focusCell(x, y, true);
        }
      }}
    >
      <div className={locked ? undefined : inputClasses.join(" ")}>{inner}</div>
    </div>
  );
};

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  const { x, y } = ownProps;
  const { dragging, focused, puzzle } = state.sudoku.present;

  return {
    dragging,
    focused: focused[y][x],
    locked: puzzle.locked[y][x],
    value: puzzle.values[y][x],
    centreMarks: puzzle.centreMarks[y][x],
    cornerMarks: puzzle.cornerMarks[y][x],
  };
};

const mapDispatchToProps = {
  startDragging: actions.setDragging.bind(undefined, true),
  focusCell: actions.focusCell,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cell);
