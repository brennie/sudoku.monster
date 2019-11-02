import * as React from "react";
import { connect } from "react-redux";

import Sudoku from "sudoku.monster/components/Sudoku";
import { State, actions } from "sudoku.monster/components/Sudoku/ducks.ts";
import * as styles from "./style.pcss";

interface StateProps {
  dragging: boolean;
}

type Props = StateProps & {
  clearFocus: () => void;
  stopDragging: () => void;
};

const SudokuMonster = (props: Props): JSX.Element => {
  const { dragging, clearFocus, stopDragging } = props;

  return (
    <div
      className={styles["sudoku-monster"]}
      onMouseUp={(): void => {
        if (!dragging) {
          clearFocus();
        } else {
          stopDragging();
        }
      }}
    >
      <div className={styles["sudoku-monster__banner"]}>
        <h1>sudoku.monster</h1>
      </div>
      <Sudoku />
    </div>
  );
};

const mapDispatchToProps = {
  clearFocus: (): ReturnType<typeof actions.clearFocus> => actions.clearFocus(),
  stopDragging: (): ReturnType<typeof actions.setDragging> =>
    actions.setDragging(false),
};

const mapStateToProps = (state: State): StateProps => ({
  dragging: state.dragging,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SudokuMonster);
