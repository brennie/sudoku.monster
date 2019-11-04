const SET_MODE = "sudoku.monster/ui/SET_MODE";
const SHOW_RESET_DIALOG = "sudoku.monster/ui/SHOW_RESET_DIALOG";

export enum Mode {
  Normal = "normal",
  Corner = "corner",
  Centre = "centre",
}

interface SetModeAction {
  type: "sudoku.monster/ui/SET_MODE";
  payload: {
    mode: Mode;
  };
}

const setMode = (mode: Mode): SetModeAction => ({
  type: SET_MODE,
  payload: { mode },
});

interface ShowResetDialogAction {
  type: "sudoku.monster/ui/SHOW_RESET_DIALOG";
  payload: {
    show: boolean;
  };
}

const showResetDialog = (show: boolean): ShowResetDialogAction => ({
  type: SHOW_RESET_DIALOG,
  payload: { show },
});

export const actions = {
  setMode,
  showResetDialog,
};

export type Action = SetModeAction | ShowResetDialogAction;

export interface State {
  mode: Mode;
  resetDialogShown: boolean;
}

const defaultState: State = {
  mode: Mode.Normal,
  resetDialogShown: false,
};

export default (state: State = defaultState, action: Action): State => {
  switch (action.type) {
    case SET_MODE:
      return {
        ...state,
        mode: action.payload.mode,
      };

    case SHOW_RESET_DIALOG:
      return {
        ...state,
        resetDialogShown: action.payload.show,
      };

    default:
      return state;
  }
};
