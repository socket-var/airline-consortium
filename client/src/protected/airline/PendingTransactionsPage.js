import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
    paddingBottom: theme.spacing.unit * 2
  }
});

class AirlineDashboard extends React.Component {
  static propTypes = {};

  state = {
    flightNameField: "",
    numSeatsField: "",
    flights: [],
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onInputChange = evt => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
  };

  async componentDidMount() {
    try {
      // TODO: protect with JWT later

      const result = await axios.post("/api/airline/list-flights", {
        airlineId: this.props.airlineId
      });

      console.debug(result.data);

      this.setState({ flights: result.data.flights });
    } catch (err) {
      console.error(err);
    }
  }

  addNewFlight = async () => {
    try {
      // TODO: protect with JWT later

      const { flightNameField, numSeatsField } = this.state;

      const result = await axios.post("/api/airline/add-flight", {
        airlineId: this.props.airlineId,
        flightName: flightNameField,
        numSeats: parseInt(numSeatsField)
      });

      console.debug(result.data);

      this.setState(prevState => {
        const state = Object.assign({}, prevState);
        state.flights.push(result.data.flight);
        state.open = false;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { flights } = this.state;
    const { classes } = this.props;

    let flightsList;

    if (flights.length > 0) {
      flightsList = flights.map((flight, idx) => (
        <Paper key={idx} className={classes.listItem} elevation={1}>
          <Typography variant="h5" component="h3">
            {flight.flightName}
          </Typography>
          <Typography component="p">
            Seating Capacity: {flight.capacity}
          </Typography>
          <Typography component="p">
            Number of seats remaining: {flight.numSeatsRemaining}
          </Typography>
        </Paper>
      ));
    }

    return (
      <div>
        <AddNewFlightForm
          onInputChange={this.onInputChange}
          onSubmit={this.addNewFlight}
          open={this.state.open}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
        />

        <div>
          <ul>{flightsList}</ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  airlineId: state.auth.user._id
});

const mapDispatchToProps = {};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AirlineDashboard)
);
