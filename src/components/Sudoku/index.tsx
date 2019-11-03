import * as React from "react";
import { connect } from "react-redux";

import Cell from "sudoku.monster/components/Cell";
import { State } from "sudoku.monster/ducks";
import { actions, PencilMarkKind } from "sudoku.monster/ducks/sudoku";
import { Mode } from "sudoku.monster/ducks/ui";
import { Value, parseValue } from "sudoku.monster/sudoku";
import * as styles from "./style.pcss";

interface StateProps {
  mode: Mode;
}

type Props = StateProps & {
  setCells: (value: Value | null) => void;
  togglePencilMarks: (kind: PencilMarkKind, value: Value | null) => void;
};

class Sudoku extends React.Component<Props, {}> {
  onKeyDown: (e: KeyboardEvent) => void;

  constructor(props: Props) {
    super(props);

    this.onKeyDown = (e: KeyboardEvent): void => {
      const { mode, setCells, togglePencilMarks } = this.props;

      let valueAction: (value: Value | null) => void;
      switch (mode) {
        case Mode.Normal:
          valueAction = setCells;
          break;

        case Mode.Corner:
          valueAction = togglePencilMarks.bind(
            undefined,
            PencilMarkKind.Corner,
          );
          break;

        case Mode.Centre:
          valueAction = togglePencilMarks.bind(
            undefined,
            PencilMarkKind.Centre,
          );
          break;

        default:
          return;
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        valueAction(null);
      } else if (e.key.length === 1) {
        const value = parseValue(e.key);
        if (value !== null) {
          valueAction(value);
        }
      }
    };
  }

  public componentDidMount(): void {
    document.body.addEventListener("keydown", this.onKeyDown);
  }

  public componentWillUnmount(): void {
    document.body.removeEventListener("keydown", this.onKeyDown);
  }

  render(): JSX.Element {
    const subgrids = [];

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const cells = [];

        for (let i = 0; i < 9; i++) {
          const cellY = y * 3 + Math.floor(i / 3);
          const cellX = x * 3 + (i % 3);
          cells.push(<Cell key={`${cellY}${cellX}`} x={cellX} y={cellY} />);
        }

        subgrids.push(
          <div key={`${y}${x}`} className={styles["subgrid"]}>
            {cells}
          </div>,
        );
      }
    }

    return <div className={styles["grid"]}>{subgrids}</div>;
  }
}

const mapStateToProps = (state: State): StateProps => ({
  mode: state.ui.mode,
});

const mapDispatchToProps = {
  setCells: actions.setCells,
  togglePencilMarks: actions.togglePencilMarks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sudoku);
