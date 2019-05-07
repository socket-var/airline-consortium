import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import askContract from "../../ethereum/contract";
import web3Instance from "../../ethereum/initMetamask";
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

class PendingTransactionsPage extends React.Component {
  static propTypes = {};

  state = {
    transactions: []
  };

  makePayment = async evt => {
    let { key, idx } = evt.currentTarget.dataset;
    key = JSON.parse(key);
    console.debug(key, idx);
    try {
      const paymentBC = await askContract.methods
        .settlePayment(key.payee.accountAddress)
        .send({
          from: key.payer.accountAddress,
          value: web3Instance.utils.toWei("10", "ether")
        });
      console.debug(paymentBC);
      // TODO: Test this
      await axios.post("/api/airline/save-tx", {
        txId: key._id
      });

      this.props.openAppSnackbar("Transaction successful");
      this.setState(prevState => {
        const newState = Object.assign({}, prevState);
        newState.transactions.splice(idx, 1);

        return newState;
      });
    } catch (err) {
      console.debug(err);
      ajaxErrorHandler(err);
    }
  };

  async componentDidMount() {
    try {
      const result = await axios.post("/api/airline/get-pending-txns", {
        airlineId: this.props.airlineId
      });

      console.debug(result.data);

      this.setState({ transactions: result.data.transactions });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { transactions } = this.state;
    const { classes, airlineId } = this.props;

    let txList;

    if (transactions.length > 0) {
      txList = transactions.map((tx, idx) => (
        <Paper key={idx} className={classes.listItem} elevation={1}>
          {tx.payer._id !== airlineId && <Typography component="h3">From: {tx.payer.name}</Typography>}
          {tx.payee._id !== airlineId && <Typography component="p">To: {tx.payee.name}</Typography>}
          <Typography component="p">Amount: {tx.amount} ether</Typography>
          {airlineId === tx.payer._id && (
            <Button
              onClick={this.makePayment}
              variant="contained"
              color="primary"
              className={classes.submit}
              data-key={JSON.stringify(tx)}
              data-idx={idx}
            >
              Make payment
            </Button>
          )}
        </Paper>
      ));
    }

    return (
      <ListView
        title="Pending Transactions:"
        placeholder="No pending transactions!! Check back later."
        items={txList}
      />
    );
  }
}

const mapStateToProps = state => ({
  airlineId: state.auth.user._id
});

const mapDispatchToProps = {
  openAppSnackbar
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PendingTransactionsPage)
);
