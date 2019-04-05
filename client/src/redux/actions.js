import "./actionTypes";
import { REGISTER_USER_SUCCESS } from "./actionTypes";
import axios from "axios";

export const registerUser = () => async dispatch => {
  // const result = await axios.post("some_url", {});
  // console.log(result.data);
  setTimeout(() => {
    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: { username: "foo", isAdmin: false }
    });
  }, 2000);
};
