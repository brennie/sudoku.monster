import * as React from "react";
import { connect } from "react-redux";

import Cell from "sudoku.monster/components/Cell";
import { actions } from "sudoku.monster/ducks/sudoku";
import { Value, parseValue } from "sudoku.monster/sudoku";
import * as styles from "./style.pcss";

interface Props {
  setCells: (value: Value) => void;
}

class Sudoku extends React.Component<Props, {}> {
  onKeyDown: (e: KeyboardEvent) => void;

  constructor(props: Props) {
    super(props);

    this.onKeyDown = (e: KeyboardEvent): void => {
      const { setCells } = this.props;

      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        setCells(null);
      } else if (e.key.length === 1) {
        const value = parseValue(e.key);
        if (value !== null) {
          setCells(value);
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

const mapDispatchToProps = {
  setCells: (value: Value): ReturnType<typeof actions.setCells> =>
    actions.setCells(value),
};

export default connect(
  undefined,
  mapDispatchToProps,
)(Sudoku);
