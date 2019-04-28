import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const AddNewFlightForm = ({
  onInputChange,
  onSubmit,
  handleClickOpen,
  handleClose,
  open
}) => {
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add flight
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Flight</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="flightNameField"
            label="Flight Name"
            type="text"
            fullWidth
            onChange={onInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="numSeatsField"
            label="Capacity"
            type="number"
            fullWidth
            onChange={onInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddNewFlightForm;
