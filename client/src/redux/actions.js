import "./actionTypes";
import {
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR
} from "./actionTypes";
import axios from "axios";
import askContract from "../ethereum/contract";
import web3Instance from "../ethereum/initMetamask";
import ajaxErrorHandler from "../common/ajaxErrorHandler";

/**
 *
 * @param {*} formFields
 * check if passwords match
 * get userType from checkbox
 * send request to server
 * dispatch register status
 */
export const registerUser = formFields => async dispatch => {
  const {
    nameField,
    emailField,
    passwordField,
    confirmPasswordField,
    accountAddressField,
    depositField,
    registerAs
  } = formFields;
  console.debug(formFields);

  // TODO: Allow admins to signup using referral
  if (passwordField === confirmPasswordField) {
    // call contract function and then register with the server
    console.debug(registerAs);
    if (registerAs === "airline") {
      try {
        // TODO: check deposit field for optimal value
        const resultBC = await askContract.methods.register().send({
          from: window.web3.eth.accounts[0],
          value: web3Instance.utils.toWei(depositField, "ether")
        });
        console.debug(resultBC);
      } catch (err) {
        console.error(err);
        return err;
      }
    }

    try {
      const result = await axios.post("/api/auth/signup", {
        name: nameField,
        email: emailField,
        password: passwordField,
        userType: registerAs,
        accountAddress: accountAddressField
      });

      console.log(result.data);

      const user = Object.assign(
        { userType: result.data.userType },
        result.data.user
      );

      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user }
      });
    } catch (err) {
      // TODO: use color based on type
      ajaxErrorHandler(err, dispatch);
    }
  } else {
    console.error("Passwords do not match");
    dispatch({
      type: OPEN_SNACKBAR,
      payload: { message: "Passwords do not match", openSnackbar: true }
    });
  }
};
/**
 *
 * @param {*} formFields
 * get user type and send email, password, userType to server
 * dispatch login status
 */
export const loginUser = formFields => async dispatch => {
  const { emailField, passwordField, loginAs } = formFields;

  try {
    const result = await axios.post("/api/auth/login", {
      email: emailField,
      password: passwordField,
      userType: loginAs
    });
    console.log(result.data);

    let balance;

    if (loginAs === "airline") {
      balance = await askContract.methods.balanceOf(window.web3.eth.accounts[0]).call({
        from: window.web3.eth.accounts[0]
      });

      balance = web3Instance.utils.fromWei(balance, "ether");

      console.debug(balance);
    }

  
    const user = Object.assign(
      { userType: result.data.userType },
      result.data.user
    );

    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: { user, balance }
    });

    dispatch({
      type: OPEN_SNACKBAR,
      payload: { message: result.data.message, openSnackbar: true }
    });
  } catch (err) {
    // TODO: use color based on type
    ajaxErrorHandler(err, dispatch);
  }
};

export const signoutUser = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {}
  };
};

export const openAppSnackbar = message => {
  return {
    type: OPEN_SNACKBAR,
    payload: { message, openSnackbar: true }
  };
};

export const closeAppSnackbar = () => {
  return {
    type: CLOSE_SNACKBAR,
    payload: { openSnackbar: false, message: "" }
  };
};
