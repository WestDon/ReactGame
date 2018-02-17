import React from "react";
import RunningLayout from '../RunningApp/RunningLayout/RunningLayout.jsx';
import './RunningApp.css';

class RunningApp extends React.Component {

    constructor(props) {
        super(props);

        this.state = { gameStart:false }; //Initialize state
    }

    render() {

        return (
            <div className="game-container">           
                <RunningLayout startGame={this.state.gameStart} />
            </div>);
    }
}

export default RunningApp;