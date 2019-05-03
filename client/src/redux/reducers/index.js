import { combineReducers } from "redux";
import auth from "./authReducer";
import appSnackbar from "./snackbarReducer";

export default combineReducers({ auth, appSnackbar });
