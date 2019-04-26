import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import AirlineDashboard from "./AirlineDashboard";

export default class AirlineLandingPage extends Component {
  static propTypes = {
    // prop: PropTypes
  };

  render() {
    const { match } = this.props;
    return (
      <div>
        <Switch>
          <Route
            path={`${match.path}/dashboard`}
            exact
            render={props => <AirlineDashboard {...props} />}
          />
        </Switch>
      </div>
    );
  }
}
