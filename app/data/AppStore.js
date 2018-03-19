import {ReduceStore} from "flux/utils";
import Actions from "./Actions";
import ActionTypes from "./ActionTypes";
import AppDispatcher from "./AppDispatcher";
 
class PhonesStore extends ReduceStore{
    constructor()
    {
        super(AppDispatcher);
    }
    getInitialState() {
        
        //set initial state
        return {maxScore: 0};
    }
 
    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.GET_MAX:
                return {...state, maxScore: +action.maxValue};

            default:
                return state;
        }
    }
}
export default new PhonesStore();