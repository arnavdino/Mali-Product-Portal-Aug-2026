import React, { useState } from "react";
import { Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Styles } from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Class from "better-classnames";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Button } from "./button";
import { FaCross, FaWindowClose } from "react-icons/fa";

interface DialogState {
  title: string;
  errorMessage: string;
  component: JSX.Element;
  tabs?: Tabs;
  showCancel: boolean;
  show: boolean;
  showFooter: boolean;
  onClose: any;
  onSave: any;
  okButton: string;
}
interface Tabs {
  one: Tab;
  two: Tab;
}
interface Tab {
  component: JSX.Element;
  name: string;
}
interface DialogContextValue {
  showDialog(
    component: JSX.Element | React.FC,
    title: string,
    showFooter: boolean,
    onClose?: () => void,
    okButton?: string,
    onSave?: () => void,
    showCancel?: boolean
  ): void;
  closeDialog(): void;
  setErrorMessage(message: string): void;
}
interface DialogTitleProps {
  classes: any;
  onClose: any;
  children: any;
  id: string;
}

const DialogContext = React.createContext<DialogContextValue>(
  {} as DialogContextValue
);
export const useDialog = () => React.useContext(DialogContext);

const styles: Styles<Theme, {}> = (theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    position: "relative",
  },
}))(MuiDialogContent);

export const DialogProvider: React.FC = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogState>({
    show: false,
  } as DialogState);
  const [errorMessage, setErrorMessage] = useState("");
  const show = dialogState.show;
  const title = dialogState.title;
  const component = dialogState.component;
  const tabs = dialogState.tabs;
  const showCancel = dialogState.showCancel;
  const onClose = dialogState.onClose;
  const closeDialog = () => {
    setDialogState({ ...dialogState, show: false });
    setErrorMessage("");
    onClose();
  };
  const setDialogComponent = (component: JSX.Element) => {
    setDialogState({ ...dialogState, component: component });
  };
  const showDialog = (
    component: JSX.Element,
    title: string,
    showFooter: boolean,
    onClose = () => {},
    okButton = "Ok",
    onSave = () => {},
    showCancel = false
  ) => {
    setDialogState({
      ...dialogState,
      component: component,
      title: title,
      showFooter: showFooter,
      onClose: onClose,
      okButton: okButton,
      showCancel: showCancel,
      onSave: onSave,
      show: true,
    });
  };
  const AppDialog = () => {
    return (
      <div key={title} className="rounded-2xl">
        <Dialog
          id="app_dialog"
          onClose={() => closeDialog()}
          aria-labelledby="customized-dialog-title"
          open={show}
        >
          <DialogContent
            key={title}
            className="overflow-hidden bg-main border-green border"
            style={{ borderRadius: 20 }}
          >
            <FaWindowClose
              className="ml-auto green cursor-pointer"
              onClick={() => closeDialog()}
            />
            {
              <div
                className={Class("text-red-600 font-bold", {
                  hidden: !errorMessage,
                  "my-2": "_DEFAULT_",
                })}
              >
                {errorMessage}
              </div>
            }
            {component}
            {dialogState.showFooter && (
              <div id="dialog_footer">
                {showCancel ? (
                  <Button
                    className="app_button"
                    style={{ width: "40%" }}
                    onClick={() => closeDialog()}
                  >
                    Cancel
                  </Button>
                ) : null}
                <Button
                  className="bg-purple-500 py-2 px-8 rounded-md text-white font-bold outline-none"
                  onClick={() => dialogState.onSave}
                >
                  {dialogState.okButton}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  };
  return (
    <DialogContext.Provider
      value={{ showDialog, closeDialog, setErrorMessage }}
    >
      <AppDialog />
      {children}
    </DialogContext.Provider>
  );
};
