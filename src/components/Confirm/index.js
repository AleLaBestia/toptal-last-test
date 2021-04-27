import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";

export default function Confirm(props) {
  const { open, confirmText, handleClose, handleSubmit } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {confirmText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          No
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
