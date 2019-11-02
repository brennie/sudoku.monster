import * as React from "react";
import { connect } from "react-redux";

import { Value } from "sudoku.monster/sudoku.ts";
import { State, actions } from "sudoku.monster/components/Sudoku/ducks.ts";
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
  const { dragging, focused, sudoku } = state;

  return {
    dragging,
    focused: focused[y][x],
    locked: sudoku.locked[y][x],
    value: sudoku.values[y][x],
  };
};

const mapDispatchToProps = {
  startDragging: (): ReturnType<typeof actions.setDragging> =>
    actions.setDragging(true),
  focusCell: (
    x: number,
    y: number,
    union: boolean,
  ): ReturnType<typeof actions.focusCell> => actions.focusCell(x, y, union),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cell);
