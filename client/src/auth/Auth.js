import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";

import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";

import { registerUser, loginUser } from "../redux/actions";

class Auth extends Component {
  state = {
    emailField: "",
    passwordField: "",
    confirmPasswordField: "",
    accountAddressField: "",
    depositField: 0,
    registerAs: "",
    loginAs: ""
  };

  handleAuthType = name => event => {
    this.setState({ [name]: event.target.value });
  };

  onInputChange = evt => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
  };

  signupHandler = evt => {
    evt.preventDefault();
    this.props.registerUser(Object.assign({}, this.state));
  };

  loginHandler = evt => {
    evt.preventDefault();
    this.props.loginUser(Object.assign({}, this.state));
  };

  accountSwitchListener = accounts => {
    this.setState({
      accountAddressField: window.web3.eth.accounts[0] || ""
    });
  };

  // for now only need account change detection for signup
  componentDidMount() {
    window.ethereum.on("accountsChanged", this.accountSwitchListener);
    this.setState({
      accountAddressField: window.web3.eth.accounts[0] || ""
    });
  }

  componentWillUnmount() {
    window.ethereum.off("accountsChanged", this.accountSwitchListener);
  }

  renderAuthPage = (AuthPage, customProps) => routerProps => {
    const { userType } = this.props;
    if (userType === "passenger") {
      return <Redirect to="/passenger/dashboard" />;
    } else if (userType === "airline") {
      return <Redirect to="/airline/dashboard" />;
    } else if (userType === "admin") {
      return <Redirect to="/admin/dashboard" />;
    } else {
      return (
        <AuthPage
          {...routerProps}
          {...customProps}
          accountAddressField={this.state.accountAddressField}
        />
      );
    }
  };

  render() {
    const { match } = this.props;
    const { registerAs, loginAs } = this.state;

    const signupProps = {
      onSubmit: this.signupHandler,
      handleAuthType: this.handleAuthType,
      onInputChange: this.onInputChange,
      registerAs
    };

    const loginProps = {
      onSubmit: this.loginHandler,
      handleAuthType: this.handleAuthType,
      onInputChange: this.onInputChange,
      loginAs
    };

    return (
      <Switch>
        {/* TODO: if logged in redirect to dashboard */}
        <Route
          path={`${match.path}/register`}
          exact
          render={this.renderAuthPage(SignupPage, signupProps)}
        />
        <Route
          path={`${match.path}/login`}
          exact
          render={this.renderAuthPage(LoginPage, loginProps)}
        />
      </Switch>
    );
  }
}

const mapStateToProps = state => {
  return {
    userType: state.auth.user.userType
  };
};

const mapDispatchToProps = {
  registerUser,
  loginUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
