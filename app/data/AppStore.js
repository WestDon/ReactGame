import {ReduceStore} from "flux/utils";
import Actions from "./Actions.js";
import ActionTypes from "./ActionTypes.js";
import AppDispatcher from "./AppDispatcher.js";
 
class PhonesStore extends ReduceStore{
    constructor()
    {
        super(AppDispatcher);
    }
    getInitialState() {
        //set initial state
        return {obj: 123};
    }
 
    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.ADD_TEST:
                //return new state
                //var stateNew = {...state, objList: state.objList};
                return {...state};

            default:
                return state;
        }
    }
}
export default new PhonesStore();