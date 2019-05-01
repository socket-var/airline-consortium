import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import AirlineDashboard from "./AirlineDashboard";
import AirlineRequestsView from "./AirlineRequestsView";
import PendingTransactionsPage from "./PendingTransactionsPage";

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
          <Route
            path={`${match.path}/pending-requests`}
            exact
            render={props => <AirlineRequestsView {...props} />}
          />
          <Route
            path={`${match.path}/pending-transactions`}
            exact
            render={props => <PendingTransactionsPage {...props} />}
          />
        </Switch>
      </div>
    );
  }
}
