import AppContainer from "./containers/AppContainer";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFound from './containers/NotFound/NotFound';
 
ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={AppContainer} />
            <Route component={NotFound} />
        </Switch>
    </Router>,
    document.getElementById("app"));