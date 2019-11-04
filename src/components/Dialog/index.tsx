import * as React from "react";
import { createPortal } from "react-dom";

import * as styles from "./style.pcss";

interface DialogProps {
  title: string;
  close: () => void;
}

const DialogContext = React.createContext((): void => void 0);

export class Dialog extends React.Component<DialogProps> {
  render(): JSX.Element {
    const { children, close, title } = this.props;

    const container = document.getElementById("dialog-container") as Element;
    return createPortal(
      <>
        <div className={styles["dialog__backdrop"]} />
        <div className={styles["dialog"]} aria-modal="true">
          <div className={styles["dialog__banner"]}>
            <h2 className={styles["dialog__title"]} aria-label="true">
              {title}
            </h2>
            <button
              className={styles["dialog__close"]}
              type="button"
              aria-label="Close Dialog"
              onClick={close}
            />
          </div>
          <DialogContext.Provider value={close}>
            {children}
          </DialogContext.Provider>
        </div>
      </>,
      container,
    );
  }
}

export const DialogContent = ({
  children,
}: React.PropsWithChildren<{}>): JSX.Element => (
  <div className={styles["dialog__content"]}>{children}</div>
);

export const DialogButtons = ({
  children,
}: React.PropsWithChildren<{}>): JSX.Element => (
  <div className={styles["dialog__buttons"]}>{children}</div>
);

interface ButtonProps {
  onClick: () => void;
}

export const DialogButton = ({
  onClick,
  children,
}: React.PropsWithChildren<ButtonProps>): JSX.Element => {
  const close = React.useContext(DialogContext);

  return (
    <button
      className={styles["dialog__button"]}
      type="button"
      onClick={(): void => {
        onClick();
        close();
      }}
    >
      {children}
    </button>
  );
};
