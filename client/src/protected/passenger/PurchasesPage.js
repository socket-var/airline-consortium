import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import { Link } from "react-router-dom";
import ListView from "../../common/ListView";
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

export class PurchasesPage extends React.Component {
  static propTypes = {};

  state = {
    purchases: []
  };

  async componentDidMount() {
    try {
      const results = await axios.post("/api/passenger/get-purchases", {
        userId: this.props.currentUser._id
      });
      console.log(results.data);

      this.setState({
        purchases: results.data.purchases
      });
    } catch (err) {
      console.error(err);
      ajaxErrorHandler(err);
    }
  }

  render() {
    const { purchases } = this.state;
    const { classes, setFlightChangeFlag } = this.props;

    let flightsList;

    if (purchases.length > 0) {
      flightsList = purchases.map((ticket, idx) => (
        <Paper key={idx} className={classes.listItem} elevation={1}>
          <Typography variant="h5" component="h3">
            {ticket.flight.flightName}
          </Typography>
          <Typography component="p">
            Ticket ID: #{ticket._id}
          </Typography>
          <Typography component="p">
            Airline Name: {ticket.flight.airline.name}
          </Typography>
          <Typography component="p">Status: {ticket.status}</Typography>
          {(ticket.status === "Booked" || ticket.status === "Booked (flight changed)") && <Button
            onClick={setFlightChangeFlag}
            variant="contained"
            color="primary"
            className={classes.submit}
            data-key={JSON.stringify(ticket)}
            to="/passenger/flight-change"
            component={Link}
          >
            Request
          </Button>}
        </Paper>
      ));
    }

    return (
      <ListView
        title="Your purchases:"
        items={flightsList}
        placeholder="Book a flight to see your purchases here."
      />
    );
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
  )(PurchasesPage)
);
