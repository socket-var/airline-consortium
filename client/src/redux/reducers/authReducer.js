import {
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  REGISTER_USER_FAILED,
  LOGIN_USER_FAILED,
  LOGOUT_USER_SUCCESS
} from "../actionTypes";

const initialState = {
  user: {},
  balance: "NA"
};
export default (state = Object.assign({}, initialState), action) => {
  switch (action.type) {
    case REGISTER_USER_SUCCESS:
    case LOGIN_USER_SUCCESS:
      return { user: action.payload.user, balance: action.payload.balance || "NA" };
    case REGISTER_USER_FAILED:
    case LOGIN_USER_FAILED:
      // TODO: better error handling
      return state;
    case LOGOUT_USER_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
