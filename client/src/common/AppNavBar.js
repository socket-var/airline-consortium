// TODO: show user name on the nav bar
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { signoutUser } from "../redux/actions";

import { connect } from "react-redux";

import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  floatToolBarItems: {
    justifyContent: "space-between"
  },
  logo: {
    marginRight: "2em",
    textDecoration: "none"
  },
  growChild: {
    flexGrow: 1
  },
  defaultChild: {
    flexGrow: 0
  },
  navP: {
    padding: "0.5em",
    marginRight: "0.5em"
  }
});

class AppNavBar extends React.Component {
  static propTypes = {
    userType: PropTypes.string,
    classes: PropTypes.object.isRequired,
    signoutUser: PropTypes.func.isRequired
  };
  state = {
    value: 0,
    openRight: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  toggleDrawer = open => () => {
    this.setState({
      openRight: open
    });
  };

  signoutHandler = evt => {
    evt.preventDefault();
    this.props.signoutUser();
  };

  render() {
    const { classes, userType, userName, balance } = this.props;
    const { value, openRight } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={userType ? "" : classes.floatToolBarItems}>
            <Typography
              variant="h3"
              color="inherit"
              className={[classes.defaultChild, classes.logo].join(" ")}
              to="/"
              component={Link}
            >
              ASK<sup>&copy;</sup>
            </Typography>

            {!userType && (
              <div>
                <Button
                  color="inherit"
                  className={classes.defaultChild}
                  to="/auth/register"
                  component={Link}
                >
                  Register
                </Button>
                <Button
                  color="inherit"
                  className={classes.defaultChild}
                  to="/auth/login"
                  component={Link}
                >
                  Login
                </Button>
              </div>
            )}

            {(userType === "passenger" || userType === "airline") && (
              <React.Fragment>
                <Tabs
                  value={value}
                  onChange={this.handleChange}
                  className={classes.growChild}
                >
                  <Tab
                    label="Dashboard"
                    to={`/${userType}/dashboard`}
                    component={Link}
                    key="0"
                  />
                  {userType === "passenger" && (
                    <Tab
                      label="Purchases"
                      to={`/${userType}/purchases`}
                      component={Link}
                      key="1"
                    />
                  )}
                  {userType === "airline" && [
                    <Tab
                      label="Requests"
                      to={`/${userType}/pending-requests`}
                      component={Link}
                      key="2"
                    />,
                    <Tab
                      label="Transactions"
                      to={`/${userType}/pending-transactions`}
                      component={Link}
                      key="3"
                    />
                  ]}
                </Tabs>
              </React.Fragment>
            )}

            {userType && (
              <React.Fragment>
                <p className={classes.navP}>Welcome {userName}</p>
                <p className={classes.navP}>Balance: {balance}</p>
                <Button
                  color="inherit"
                  className={classes.defaultChild}
                  onClick={this.signoutHandler}
                >
                  Sign out
                </Button>
              </React.Fragment>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userType: state.auth.user.userType,
  userName: state.auth.user.name,
  balance: state.auth.balance
});

const mapDispatchToProps = {
  signoutUser
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppNavBar)
);
