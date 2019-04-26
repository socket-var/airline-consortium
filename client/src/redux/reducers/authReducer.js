import {
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  REGISTER_USER_FAILED,
  LOGIN_USER_FAILED,
  LOGOUT_USER_SUCCESS
} from "../actionTypes";

const initialState = {
  user: {}
};
export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER_SUCCESS:
    case LOGIN_USER_SUCCESS:
      return { user: action.payload.user };
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
