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
            onTest: Actions.addTest
        }; 
    }
    //Set Store state or actions to props if needed 
    render() { 
        return <RunningApp />; 
    } 
} 
export default Container.create(AppContainer);