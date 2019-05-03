import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import ListView from "../../common/ListView";
import { openAppSnackbar } from "../../redux/actions";
import ajaxErrorHandler from "../../common/ajaxErrorHandler";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  listItem: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: "80%",
    margin: "1.5em auto"
  }
});

export class PassengerDashboard extends React.Component {
  static propTypes = {};

  state = {
    availableFlights: [],
    purchases: []
  };

  async componentDidMount() {
    const { currentUser, currentTicket } = this.props;

    try {
      const results = await axios.post("/api/passenger/get-available-flights", {
        userId: currentUser._id
      });

      let availableFlights = results.data.flights;
      if (currentTicket) {
        availableFlights = availableFlights.filter(
          flight => flight._id !== currentTicket.flight._id
        );
      }

      this.setState({
        availableFlights
      });
    } catch (err) {
      console.error(err);
    }
  }

  bookFlight = async evt => {
    const { currentUser } = this.props;

    const flightId = evt.currentTarget.dataset.key;
    console.debug(flightId);

    try {
      const result = await axios.post("/api/passenger/book-flight", {
        userId: currentUser._id,
        flightId
      });

      console.debug(result.data);

      this.props.openAppSnackbar(result.data.message);

      this.setState(prevState => {
        const state = Object.assign({}, prevState);
        state.purchases.push(result.data.ticket);
      });
    } catch (err) {
      console.error(err);
      ajaxErrorHandler(err);
    }
  };

  requestFlightChange = async evt => {
    const { currentUser } = this.props;
    const newFlightId = evt.currentTarget.dataset.key;

    try {
      const result = await axios.post("/api/passenger/request-flight-change", {
        userId: currentUser._id,
        ticketId: this.props.currentTicket._id,
        newFlightId
      });

      this.props.openAppSnackbar(result.data.message);
    } catch (err) {
      console.error(err);
      ajaxErrorHandler(err);
    }
  };

  render() {
    const { availableFlights } = this.state;
    const { classes, isFlightChange } = this.props;

    let flightsList;

    if (availableFlights.length > 0) {
      flightsList = availableFlights.map((flight, idx) => (
        <Paper key={idx} className={classes.listItem} elevation={1}>
          <Typography variant="h5" component="h3">
            {flight.flightName}
          </Typography>
          <Typography component="p">
            Airline Name: {flight.airline.name}
          </Typography>
          <Typography component="p">
            Number of seats remaining: {flight.numSeatsRemaining}
          </Typography>
          {!isFlightChange && (
            <Button
              onClick={this.bookFlight}
              variant="contained"
              color="primary"
              className={classes.submit}
              data-key={flight._id}
            >
              Book a ticket
            </Button>
          )}
          {isFlightChange && (
            <Button
              onClick={this.requestFlightChange}
              variant="contained"
              color="primary"
              className={classes.submit}
              data-key={flight._id}
            >
              Request flight change
            </Button>
          )}
        </Paper>
      ));
    }

    return (
      <ListView
        title="Available Flights:"
        placeholder="No flights available right now!! Check back later."
        items={flightsList}
      />
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
});
const mapDispatchToProps = {
  openAppSnackbar
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PassengerDashboard)
);
