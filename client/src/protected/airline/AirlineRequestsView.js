import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AddNewFlightForm from "./AddNewFlightForm";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
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

class AirlineRequestsView extends React.Component {
  static propTypes = {};

  state = {
    requests: []
  };

  approveRequest = async evt => {
    const { idx, key } = evt.currentTarget.dataset;
    console.debug(idx, key, evt.currentTarget);
    try {
      const result = await axios.post("/api/airline/handle-request", {
        requestId: key
      });

      console.debug(result.data);

      this.setState(prevState => {
        const newState = Object.assign({}, prevState);
        newState.requests.splice(idx, 1);

        return newState;
      });
    } catch (err) {
      console.error(err);
    }
  };

  async componentDidMount() {
    try {
      const result = await axios.post("/api/airline/get-pending-requests", {
        airlineId: this.props.airlineId
      });

      console.debug(result.data);

      this.setState({ requests: result.data.requests });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { requests } = this.state;
    const { classes } = this.props;

    let requestsList;

    if (requests && requests.length > 0) {
      requestsList = requests.map((request, idx) => (
        <Paper key={idx} className={classes.listItem} elevation={1}>
          <Typography variant="h5" component="h3">
            Request type: {request.requestType}
          </Typography>
          <Typography component="p">
            User:
            {request.ticket &&
              request.ticket.passenger &&
              request.ticket.passenger.name}
          </Typography>
          <Typography component="p">
            Airline to request:
            {request.destFlight &&
              request.destFlight.airline &&
              request.destFlight.airline.name}
          </Typography>
          <Typography component="p">
            Requested flight:{" "}
            {request.destFlight && request.destFlight.flightName}
          </Typography>
          <Button
            onClick={this.approveRequest}
            variant="contained"
            color="primary"
            className={classes.submit}
            data-key={request._id}
            data-idx={idx}
            component={Link}
          >
            Approve request
          </Button>
        </Paper>
      ));
    }

    return <div>{requestsList}</div>;
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
  )(AirlineRequestsView)
);
