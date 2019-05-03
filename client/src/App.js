import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "./App.css";
import HomePage from "./HomePage";
import { connect } from "react-redux";
import Auth from "./auth/Auth";
import AppNavBar from "./common/AppNavBar";
import PassengerLandingPage from "./protected/passenger/PassengerLandingPage";
import AdminLandingPage from "./protected/admin/AdminLandingPage";
import AirlineLandingPage from "./protected/airline/AirlineLandingPage";
import AppSnackbar from "./common/AppSnackbar";

class App extends Component {
  state = {};
  static propTypes = {
    userType: PropTypes.string
  };
  async componentDidMount() {
    try {
      // Request account access if needed
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("Denied access", error);
      // TODO: dont allow register and login routing
    }
  }

  render() {
    const { userType } = this.props;
    return (
      <Router>
        <div className="App">
          <AppSnackbar />
          <AppNavBar />
          <Route path="/" exact component={HomePage} />
          <Route path="/auth" component={Auth} />
          <Route
            path="/passenger"
            render={props =>
              userType !== "passenger" ? (
                // TODO: notify that not allowed for this user type
                <Redirect to="/auth/login" />
              ) : (
                <PassengerLandingPage
                  {...props}
                  accountAddressField={this.state.accountAddressField}
                />
              )
            }
          />
          <Route
            path="/admin"
            render={props =>
              userType !== "admin" ? (
                <Redirect to="/auth/login" />
              ) : (
                <AdminLandingPage
                  {...props}
                  accountAddressField={this.state.accountAddressField}
                />
              )
            }
          />
          <Route
            path="/airline"
            render={props =>
              userType !== "airline" ? (
                <Redirect to="/auth/login" />
              ) : (
                <AirlineLandingPage
                  {...props}
                  accountAddressField={this.state.accountAddressField}
                />
              )
            }
          />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userType: state.auth.user.userType
  };
};
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
