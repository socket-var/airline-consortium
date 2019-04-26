import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Input from "@material-ui/core/Input";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  formControl: {
    marginTop: theme.spacing.unit * 3
  }
});

const SignupPage = ({
  classes,
  onInputChange,
  onSubmit,
  accountAddressField,
  handleAuthType,
  registerAs
}) => {
  return (
    <React.Fragment>
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          {/* <div style={{ color: "red" }}>{errorMessage}</div> */}
          <form className={classes.form} onSubmit={onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="emailField">Email Address</InputLabel>
              <Input
                id="emailField"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={onInputChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="passwordField">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="passwordField"
                autoComplete="new-password"
                onChange={onInputChange}
              />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="confirmPasswordField">
                Confirm Password
              </InputLabel>
              <Input
                name="confirm-password"
                type="password"
                id="confirmPasswordField"
                autoComplete="confirm-password"
                onChange={onInputChange}
              />
            </FormControl>

            {registerAs === "airline" && (
              <React.Fragment>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="accountAddressField">
                    Ethereum Account Address
                  </InputLabel>
                  <Input
                    id="accountAddressField"
                    name="accountAddress"
                    autoComplete="accountAddressField"
                    autoFocus
                    onChange={onInputChange}
                    value={accountAddressField}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="depositField">
                    Opening deposit
                  </InputLabel>
                  <Input
                    name="deposit-field"
                    type="number"
                    id="depositField"
                    autoComplete="deposit-field"
                    onChange={onInputChange}
                  />
                </FormControl>
              </React.Fragment>
            )}

            <div>
              <a href="/auth/login">Already Registered? Login</a>
            </div>

            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Register as:</FormLabel>
              <RadioGroup
                aria-label="register as"
                name="registerAs"
                className={classes.group}
                value={registerAs}
                onChange={handleAuthType("registerAs")}
              >
                <FormControlLabel
                  value="passenger"
                  control={<Radio />}
                  label="Passenger"
                />
                <FormControlLabel
                  value="airline"
                  control={<Radio />}
                  label="Airline"
                />
              </RadioGroup>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
          </form>
        </Paper>
      </main>
    </React.Fragment>
  );
};

SignupPage.propTypes = {
  classes: PropTypes.object.isRequired,
  // errorMessage: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default withStyles(styles)(SignupPage);
