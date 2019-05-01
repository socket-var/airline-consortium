import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import askContract from "../../ethereum/contract";
import web3Instance from "../../ethereum/initMetamask";

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

  /**
- type: passenger
	- msg: "Valid request":
		call request
		update all DBs and update UI
	- msg: "rejectedBySrcAirline":
		updated all DBs and update UI


- type: airline
	- msg: "Valid request":
		call response with isDone = true
		update all DBs and update UI
	- msg: "rejectedByDestAirline":
		call response with isDone = false
		update all DBs and update UI
 */
  handleRequest = async evt => {
    const { idx, key } = evt.currentTarget.dataset;
    console.debug(idx, key, evt.currentTarget);
    try {
      // first send the request for checking
      const checkResult = await axios.post("/api/airline/check-request", {
        requestId: key
      });

      // should return with status
      // init or rejectedBySrcAirline if passenger request
      // approvedBySrcAirline or rejectedByDestAirline if airline request

      const checkData = checkResult.data.request;
      const srcAirline = checkData.srcAirline;
      const destAirline = checkData.destFlight.airline;

      const srcAirlineAddress = srcAirline.accountAddress;
      const destAirlineAddress = destAirline.accountAddress;
      console.debug(checkData, srcAirline, destAirline);
      console.debug(srcAirlineAddress, destAirlineAddress, checkData._id);
      let resultBC, paymentBC;

      // if valid passenger request, call request() method in the contract, then call approve-request
      if (
        checkData.requestType === "passenger" &&
        checkData.status === "init"
      ) {
        console.debug("passenger init");
        resultBC = await askContract.methods
          .request(
            destAirlineAddress,
            web3Instance.utils.fromAscii(checkData._id)
          )
          .send({
            from: srcAirlineAddress
          });
        console.debug(resultBC);
        await axios.post("/api/airline/approve-request", {
          requestId: key
        });
      }
      // if request type is airline
      else if (checkData.requestType === "airline") {
        // if not rejected
        // call response() with done = true and do settle payment if different airline swap
        // then make an API call to approveRequest

        if (checkData.status !== "rejectedByDestAirline") {
          // if same airline directly swap
          console.debug("airline not rejectedByDestAirline");
          if (srcAirline._id !== destAirline._id) {
            resultBC = await askContract.methods
              .response(
                srcAirlineAddress,
                web3Instance.utils.fromAscii(checkData._id),
                1
              )
              .send({
                from: destAirlineAddress
              });
            paymentBC = await askContract.methods
              .settlePayment(destAirlineAddress)
              .send({
                from: srcAirlineAddress
              });
            console.debug(paymentBC);
          }

          const approveResult = await axios.post(
            "/api/airline/approve-request",
            {
              requestId: key
            }
          );

          console.debug(approveResult.data);
        }
        // if status is rejectedByDestAirline call response with done = false
        else {
          console.debug("airline rejectedByDestAirline");
          resultBC = await askContract.methods
            .response(
              srcAirlineAddress,
              web3Instance.utils.fromAscii(checkData._id),
              0
            )
            .send({
              from: destAirlineAddress
            });
        }
      }
      console.debug(resultBC);

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
            onClick={this.handleRequest}
            variant="contained"
            color="primary"
            className={classes.submit}
            data-key={request._id}
            data-idx={idx}
            component={Link}
          >
            Handle request
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
