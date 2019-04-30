import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import PassengerDashboard from "./PassengerDashboard";
import PurchasesPage from "./PurchasesPage";

export class PassengerLandingPage extends Component {
  static propTypes = {};

  state = {
    isFlightChange: false,
    currentTicket: null
  };

  setFlightChangeFlag = evt => {
    this.setState({
      isFlightChange: true,
      currentTicket: evt.currentTarget.dataset.key
    });
  };

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
            render={props => (
              <PurchasesPage
                {...props}
                setFlightChangeFlag={this.setFlightChangeFlag}
              />
            )}
          />
          <Route
            path={`${match.path}/flight-change`}
            exact
            render={props => (
              <PassengerDashboard
                {...props}
                isFlightChange={this.state.isFlightChange}
                currentTicket={this.state.currentTicket}
              />
            )}
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
