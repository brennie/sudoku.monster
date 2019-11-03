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
  value: Value;
}

type Props = OwnProps &
  StateProps & {
    focusCell: (x: number, y: number, union: boolean) => void;
    startDragging: () => void;
  };

const Cell = (props: Props): JSX.Element => {
  const {
    dragging,
    focusCell,
    focused,
    locked,
    startDragging,
    value,
    x,
    y,
  } = props;

  const classes = [styles["cell"]];
  if (focused) {
    classes.push(styles["cell--focused"]);
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
      <span className={locked ? "" : styles["cell__input"]}>{value}</span>
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
