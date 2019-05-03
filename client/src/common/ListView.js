import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = {
  jumbotron: {
    height: "100vh",
    width: "90%",
    margin: "0 auto",
    textAlign: "center"
  }
};

const ListView = ({ title, classes, items, placeholder }) => {
  return (
    <div>
      <h1>{title}</h1>
      {items ? (
        <div>{items}</div>
      ) : (
        <Paper elevation={2} className={classes.jumbotron}>
          <Typography variant="h5" component="h3">{placeholder}</Typography>
        </Paper>
      )}
    </div>
  );
};

ListView.propTypes = {};

export default withStyles(styles)(ListView);
