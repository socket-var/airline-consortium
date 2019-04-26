import "./actionTypes";
import {
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  REGISTER_USER_FAILED,
  LOGIN_USER_FAILED,
  LOGOUT_USER_SUCCESS
} from "./actionTypes";
import axios from "axios";
import askContract from "../ethereum/contract";
import web3Instance from "../ethereum/initMetamask";

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
        email: emailField,
        password: passwordField,
        userType: registerAs,
        accountAddress: accountAddressField
      });

      console.log(result.data);

      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user: result.data.user
        }
      });
    } catch (err) {
      console.error(err);
      // TODO: dispatch failed
      dispatch({
        type: REGISTER_USER_FAILED,
        payload: {}
      });
    }
  } else {
    // TODO: notify error to user
    console.error("Passwords do not match");
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

    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: { user: result.data.user }
    });
  } catch (err) {
    console.error(err);
    // TODO: dispatch login_failed
    dispatch({
      type: LOGIN_USER_FAILED,
      payload: {}
    });
  }
};

export const signoutUser = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {}
  };
};
