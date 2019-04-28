import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";

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
    try {
      const results = await axios.post("/api/passenger/get-available-flights", {
        userId: this.props.currentUser._id
      });
      console.log(results.data);

      this.setState({
        availableFlights: results.data.flights
      });
    } catch (err) {
      console.error(err);
    }
  }

  bookFlight = async evt => {
    const { currentUser } = this.props;

    const flightId = evt.target.dataset.key;

    try {
      const result = await axios.post("/api/passenger/book-flight", {
        userId: currentUser._id,
        flightId
      });

      console.debug(result.data);

      this.setState(prevState => {
        const state = Object.assign({}, prevState);
        state.purchases.push(result.data.ticket);
      });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { availableFlights } = this.state;
    const { classes } = this.props;

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
          <Button
            onClick={this.bookFlight}
            variant="contained"
            color="primary"
            className={classes.submit}
            data-key={flight._id}
          >
            Book a ticket
          </Button>
        </Paper>
      ));
    }

    return <div>{flightsList}</div>;
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
});
const mapDispatchToProps = {};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PassengerDashboard)
);
