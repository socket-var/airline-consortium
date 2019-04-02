import { HELLO_ACTION } from "../actionTypes";

const initialState = { text: "Initial state" };
export const helloReducer = (state = initialState, action) => {
  switch (action.type) {
    case HELLO_ACTION:
      return { text: action.payload.text };
    default:
      return state;
  }
};
