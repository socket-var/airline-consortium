import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import PassengerDashboard from "./PassengerDashboard";
import PurchasesPage from "./PurchasesPage";

export class PassengerLandingPage extends Component {
  static propTypes = {};

  render() {
    const { match } = this.props;
    return (
      <div>
        <Switch>
          <Route
            path={`${match.path}/dashboard`}
            exact
            render={props => <PassengerDashboard {...props} />}
          />
          <Route
            path={`${match.path}/purchases`}
            exact
            render={props => <PurchasesPage {...props} />}
          />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PassengerLandingPage);
