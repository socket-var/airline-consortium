import { OPEN_SNACKBAR, CLOSE_SNACKBAR } from "../actionTypes";

const initialState = {
  message: "",
  openSnackbar: false
};
export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return {
        message: action.payload.message,
        openSnackbar: action.payload.openSnackbar
      };
    case CLOSE_SNACKBAR:
      return {
        openSnackbar: action.payload.openSnackbar,
        message: action.payload.message
      };
    default:
      return state;
  }
};
