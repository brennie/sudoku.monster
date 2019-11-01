export enum Mode {
  Normal = "normal",
  Corner = "corner",
  Centre = "centre",
  Colour = "colour",
}

const SET_MODE = "sudoku.monster/controls/SET_MODE";

export interface SetModeAction {
  type: "sudoku.monster/controls/SET_MODE";
  payload: {
    mode: Mode,
  };
}

const setMode = (mode: Mode): SetModeAction => ({
  type: SET_MODE,
  payload: { mode },
});

export const actions = {
  setMode,
};

export type Action = SetModeAction;

export interface State {
  mode: Mode;
}

const defaultState = {
  mode: Mode.Normal,
};

export default (state: State = defaultState, action: Action): State => {
  switch (action.type) {
    case SET_MODE:
      return {
        ...state,
        mode: action.payload.mode,
      };

    default:
      return state;
  }
};
