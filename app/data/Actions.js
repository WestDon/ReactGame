import ActionTypes from "./ActionTypes.js";
import AppDispatcher from "./AppDispatcher.js";
 
const Actions = {
  addItem(text) {
    AppDispatcher.dispatch({
      type: ActionTypes.ADD_TEST,
      text,
    });
  }
};
 
export default Actions;