import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import { closeAppSnackbar } from "../redux/actions";

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2
  }
});

class AppSnackbar extends React.Component {
  render() {
    const { classes, message, openSnackbar, closeAppSnackbar } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={closeAppSnackbar}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={closeAppSnackbar}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

AppSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  openSnackbar: state.appSnackbar.openSnackbar,
  message: state.appSnackbar.message
});

const mapDispatchToProps = {
  closeAppSnackbar
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppSnackbar)
);
