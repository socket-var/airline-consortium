import "./actionTypes";
import { HELLO_ACTION } from "./actionTypes";

export const sayHello = () => {
  return {
    type: HELLO_ACTION,
    payload: {
      text: "Hello Redux"
    }
  };
};
