import ActionTypes from "./ActionTypes.js";
import AppDispatcher from "./AppDispatcher.js";
import {getLocalStorageValue, addOrUpdateLocalStorageValue} from '../services/localStorageService'; 

const Actions = {

  getMaxValue(){
    let maxValue = getLocalStorageValue("maxValue");
    AppDispatcher.dispatch({
      type: ActionTypes.GET_MAX,
      maxValue
    });
  },

  addMaxValue(maxValue) {
    addOrUpdateLocalStorageValue("maxValue", maxValue);
    AppDispatcher.dispatch({
      type: ActionTypes.GET_MAX,
      maxValue,
    });
  }
};
 
export default Actions;