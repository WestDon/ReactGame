import RunningApp from "../components/RunningApp/RunningApp.jsx";
import {Container} from "flux/utils";
import React from "react";
import AppStore from "../data/AppStore.js";
import Actions from "../data/Actions.js";
import "../css/app.css";
 
class AppContainer extends React.Component 
{ 
    static getStores() { 
        return [AppStore];
    } 
    static calculateState(prevState) { 
        return { 
            currentState: AppStore.getState(),
            addMaxValue: Actions.addMaxValue,
        }; 
    }
    //Set Store state or actions to props if needed 
    render() {
        return <RunningApp maxScore={this.state.currentState.maxScore} />; 
    } 
} 
export default Container.create(AppContainer);